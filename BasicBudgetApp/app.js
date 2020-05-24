//BUDGET CONTROLLER MODUL
var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
   
    
    var data = {
        allitems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
    }
    
    return {
        additem: function(type, des, val){
            var newItem, ID; 
            
            //create new ID
            //if data is empty >> ID = 0 else the last ID + 1
            ID = data.allitems[type].length > 0 ? data.allitems[type][data.allitems[type].length - 1].id + 1 : 0;
            
            //create nwe item based on type
            if(type === 'exp')
                newItem = new Expense(ID, des, val);
            else if (type === 'inc')
                newItem = new Income(ID, des, val);
            
            //push it into our data structure
            data.allitems[type].push(newItem);
            return newItem;
        }
    };
    
    
})();


//UI MODUL
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    
   return {
     getInput: function(){
        return {
             type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: document.querySelector(DOMstrings.inputValue).value      
        }; 
     }, 
       
       addListItem: function(obj, type){
           var html, newHtml, element;
           //create html string with placeholder text
           if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>';
           }else{
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
       
       getDOMstrings: function(){
        return DOMstrings;
     }
       
   };
    
    
    
})();



//APP CONTROLLER MODUL
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();  
        document.querySelector(DOM.inputBtn).addEventListener('click',  ctrAddItem);

            //adding key press event to the whole document 
        document.addEventListener('keypress', function(event){
           if(event.keyCode === 13 || event.which === 13) //older browsers use which 
              ctrAddItem();
        });


        };

        var ctrAddItem = function(){
            var input, newItem
            
            //1, get the field input data
            input = UICtrl.getInput();

            //2, add the item to the budget controller
            newitem = budgetCtrl.additem(input.type, input.description, input.value);
            
            //3, add the item to the UI
            UICtrl.addListItem(newitem, input.type);
            
            //4, calculate the budget
            //5, display the budget on the UI

        };

        return{
            init: function(){
                console.log('Application has started.');
                setupEventListeners();
            }
        };
    

    
})(budgetController, UIController);

controller.init();

