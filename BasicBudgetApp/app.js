//BUDGET CONTROLLER MODUL
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
         if(totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome)*100);
        
    };
    
    Expense.prototype.getPercentage = function(){
      return this.percentage;  
    };
    
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calulateTotal = function(type){
        var sum = 0;
        data.allitems[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allitems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        precentage: -1
    }

    return {
        additem: function (type, des, val) {
            var newItem, ID;

            //create new ID
            //if data is empty >> ID = 0 else the last ID + 1
            ID = data.allitems[type].length > 0 ? data.allitems[type][data.allitems[type].length - 1].id + 1 : 0;

            //create nwe item based on type
            if (type === 'exp')
                newItem = new Expense(ID, des, val);
            else if (type === 'inc')
                newItem = new Income(ID, des, val);

            //push it into our data structure
            data.allitems[type].push(newItem);
            return newItem;
        }, 
        
        deleteItem: function(type, id){
            var ids, index;
            ids = data.allitems[type].map(function(curr){ //map returns an array 
                return curr.id;  
            });
            
            index = ids.lastIndexOf(id);
            
            if(index !== -1)
                data.allitems[type].splice(index, 1);
            
        },
        
        calculateBudget : function(){
            //calculate total income and expenses
            calulateTotal('exp');
            calulateTotal('inc');
            
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the precentage of income that we spent
            if(data.totals.inc > 0)
                data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            
        },
        
        calculatePercentages: function(){
            
            data.allitems.exp.forEach(function(curr){
               curr.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentages: function(){
            var allPerc;
            allPerc = data.allitems.exp.map(function(curr){
                return curr.getPercentage();
            });    
            return allPerc;
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                precentage: data.precentage
            };
        }
    };


})();


//UI MODUL
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        exensesLabel: '.budget__expenses--value',
        precentageLabel: '.budget__expenses--percentage',
        container: '.container', 
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type){
          var numSplit, int, dec;
            
            // + or - before number
            // 2 decimal points
            // coma separating the thousands
            // 2310.456 -> 2,310.46
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, 3);
            }
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+')+' '+ int + '.' + dec;
            
        };
    
        var nodeListForEach = function(list, callback){
                 for(var i = 0; i < list.length; i++){
                     callback(list[i], i);
                 } 
            };

    return {
        //get input 
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        //update html 
        addListItem: function (obj, type) {
            var html, newHtml, element;
            //create html string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>';
            } else {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id); //this id is important for deletItem
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            //insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectedId){
            var element;
            element = document.getElementById(selectedId);
            element.parentNode.removeChild(element);
            
            
        },
        
        clearFields: function () {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(curr, index, array){
                curr.value = "";
            });
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            
            type = obj.budget >= 0 ? 'inc' : 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.exensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.precentage > 0)
                document.querySelector(DOMstrings.precentageLabel).textContent = obj.precentage + '%';
            else
                document.querySelector(DOMstrings.precentageLabel).textContent = '---';
        },
        
        displayPercentages: function(percentages){
            var fields;
            
            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(curr, index){
               if(percentages[index] > 0)
                    curr.textContent = percentages[index] + '%';
                else
                    curr.textContent = '---'
                
            });
            
        },

        displayMonth: function(){
            var now, year, months, month;    
            
            months = [
            'January', 
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];
            
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month]+' '+ year;
            
        },
        
        changeType: function(){
            var fields;
            
            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            ); 
        
            nodeListForEach(fields, function(curr){
               curr.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();


//APP CONTROLLER MODUL
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        //adding key press event to the whole document 
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) //older browsers use which 
                ctrlAddItem();
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

    };

    var updateBudget = function(){
        var budget;
        
        //1, calculate the budget
        budgetCtrl.calculateBudget();
        
        //2, return the budgate
        budget = budgetCtrl.getBudget();
        
        //3, display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    //update %
    var updatePercentages = function(){
        var percentages;
        
        //1, calculate percentages
        budgetCtrl.calculatePercentages();
        
        //2, read percentages from budget controller
        percentages = budgetCtrl.getPercentages();
        
        //3, update the UI 
        UICtrl.displayPercentages(percentages);
    };
    
    
    //add item
    var ctrlAddItem = function () {
        var input, newItem

        //1, get the field input data
        input = UICtrl.getInput();
        
        //if desc or value is empty or value is smaller than 0 -> don't get the input 
        if(input.description.trim() !=="" && !isNaN(input.value) && input.value > 0){
        
        //2, add the item to the budget controller
        newitem = budgetCtrl.additem(input.type, input.description, input.value);

        //3, add the item to the UI
        UICtrl.addListItem(newitem, input.type);
        
        //4, clear the fields
        UICtrl.clearFields();
        
        //5, calculate and update budget
        updateBudget();
            
        //6, calculata and update precentages
        updatePercentages();
            
        }
    };
    
    //delete item
    var ctrlDeleteItem = function(event){
        var itemId, splitId, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            //inc-1
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
            
            //1. delete item from datastructure
            budgetCtrl.deleteItem(type, ID);
            
            //2. delete item from the UI
            UICtrl.deleteListItem(itemId);
            
            //3. Update and show the new budget
            updateBudget();
            
            //4, calculata and update precentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayBudget({ 
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                precentage: -1});
            setupEventListeners();
            UICtrl.displayMonth();
        }
    };


})(budgetController, UIController);

controller.init();
