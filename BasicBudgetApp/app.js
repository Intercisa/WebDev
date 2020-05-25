//BUDGET CONTROLLER MODUL
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
        precentageLabel: '.budget__expenses--percentage'
    }


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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>';
            } else {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
          
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.exensesLabel).textContent = obj.totalExp;
            
            if(obj.precentage > 0)
                document.querySelector(DOMstrings.precentageLabel).textContent = obj.precentage + '%';
            else
                document.querySelector(DOMstrings.precentageLabel).textContent = '---';
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
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrAddItem);

        //adding key press event to the whole document 
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) //older browsers use which 
                ctrAddItem();
        });


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
    
    var ctrAddItem = function () {
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
        }
    };



})(budgetController, UIController);

controller.init();
