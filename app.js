var budgetController = (function() {
        
        var Expense = function(id, description, value)  {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };
        
        Expense.prototype.calcPercentages = function(totalExpense)   {
            if (totalExpense > 0)   {
            this.percentage = Math.round((this.value / totalExpense) * 100);
            } else {
                this.percentage = -1;
        }
        }    
        
        Expense.prototype.getPercentage = function()    {
            return this.percentage;
        }
    
        var Income = function(id, description, value)  {
            this.id = id;
            this.description = description;
            this.value = value;
        };
        
        var calculateTotal = function(type) {
            var sum = 0;
            var arr = [];
            
            if (type === "exp") {
            
                data.allItems[type].forEach(function(cur){
                sum += cur.value; 
                arr.push(cur.value);
            });
                    sumExp = arr.reduce(add, 0);          
                    function add(a, b) {
                        return a + b;
                    }
                data.sumExp = sumExp;
                data.expArr = arr.slice();
            } else {
            
                data.allItems[type].forEach(function(cur){
                sum += cur.value; 
            }); 
            }
            
            data.totals[type] = sum;
            
            
               
 
        }              
        
   
        var data = {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: -1,
            expPercentage:-1,
            expArr:[],
            sumExp:0
        };
    
    
        return  {
            addItem: function(type, des, val)   {
                var newItem, ID;
                
                
                if (data.allItems[type].length > 0) {
                
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                
                } else {
                    ID = 0;
                }
                
                if (type === 'exp') {
                    newItem = new Expense(ID, des, val);
                } else if (type === 'inc')  {
                    newItem = new Income(ID, des, val);
                }
                
                data.allItems[type].push(newItem);


                return newItem;

                
                
            }, calculateBudget: function()  {
                
                calculateTotal('exp');
                calculateTotal('inc');
                
                data.budget = data.totals.inc - data.totals.exp;
                
                if (data.budget > 0)    {
                   data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
                } else  {
                    data.percentage = -1;
                }
                
               
                   // data.expPercentage = Math.round((data.totals.exp / expense )*100);
                
           
                
           
            }, deleteItem: function(type, id) {
                    var ids, index;
                
                    ids = data.allItems[type].map(function(current) {
                        return current.id; 
                                            
                    });
                    console.log(ids);
                
                    index = ids.indexOf(id);   ///position 1
                   
                    if (index !== -1)  {
                        data.allItems[type].splice(index, 1);
                    }
                
                    calculateTotal(type);
                    data.budget = data.totals.inc - data.totals.exp;

                /*
                
                    //data.totals[type] = data.totals[type] - data.allItems[type][ID].value;
                    //data.budget = data.totals.inc - data.totals.exp;
            
                    
                */
            }, expensePercentage: function()    {
                
                    var nl = document.querySelectorAll('.item__percentage');
                    var arr = Array.prototype.slice.call(nl);
                    for (var i = 0; i < arr.length; i++) {
                    arr[i].innerHTML = Math.round((parseInt(data.expArr[i]) / parseInt(data.sumExp) ) *100) + "%";
                    }    
            },
            
            calculatePercentages: function()    {
                
                data.allItems.exp.forEach(function(cur) {
                    cur.calcPercentages(data.totals.exp);
                    
                });
                
                
            },
            
            getPercentages: function() {
                
                var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();                                   
                });
                return allPerc;
                
            },
            
            getBudget: function()   {
                return  {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage,
                    expPercentage: data.expPercentage,
                    expArr: data.expArr,
                    sumExp: data.sumExp
                }
            },
            
            testing: function() {
                console.log(data);
            } 
            

        }
        
})();

var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        BudgetExpense: '.budget__expenses--value',
        budgetExpPercentage: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
        var formatNumber = function(num, type)   {
            var numSplit, int, dec, type;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }
            
            dec = numSplit[1];
            
            
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
        };
    
        var nodeListForEach = function(list, callback)  {
        for (var i = 0; i < list.length; i++)   {
            callback(list[i], i);
        }
        };
    
    return  {
        getInput: function()    {
            return  {
            type : document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
            description : document.querySelector(DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        }, addListItem: function(obj,type)    {
            var html, newHtml;
                if (type === "inc")   {
                    
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    element = DOMstrings.incomesContainer;
                    
                    
                    } else if (type === "exp") {
                        html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                        element = DOMstrings.expensesContainer;
                        
                        
                    }
            // data.expPercentage = Math.round((data.totals.exp / expense )*100);
                            
                    
                    
                    newHtml = html.replace("%id%", obj.id);
                    newHtml = newHtml.replace("%description%", obj.description);
                    newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
                    
                    

                    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        }, deleteItemUI: function(itemID){
                deleteItem = document.getElementById(itemID);
                deleteItem.parentNode.removeChild(deleteItem);
            
        },
        
        
            
        
            clearFields: function()  {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
 
            
            var fieldsArr = Array.prototype.slice.call(fields);

            
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            
            fieldsArr[0].focus();
                
            })
            
        }, budgetUi: function(obj)  {
            
            var type;
            
            
            
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.budgetIncome).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.BudgetExpense).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
            document.querySelector(DOMstrings.budgetExpPercentage).textContent = obj.percentage + '%';
            } else  {
                document.querySelector(DOMstrings.budgetExpPercentage).textContent = "---";
            }
            
            
            
            
                     
            
        },
        
        displayPercentages: function(percentages)   {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            

            
            nodeListForEach(fields, function(current, index)    {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else  {
                    current.textContent = '---'
                }
                
                
            });
            
        },
        
        displayMonth: function()    {
          var now, months, month, year;
            
            now = new Date();
            
             months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            
            month = now.getMonth();
            
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            
        },
        
            changedType: function() {
              
                var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
                
                nodeListForEach(fields, function(cur)   {
                    
                    cur.classList.toggle('red-focus'); 
                    
                });
                
                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
                
            },

            getDomStrings: function()    {
            return DOMstrings;
            
            
        }
            
            
            
    }
    
})();

var controller = (function(budgetCtrl, UICtrl) {
    
    
        
        var setupEventListener = function() {
        var DOM = UICtrl.getDomStrings();    
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)   
        document.addEventListener('keypress', function(event)   {
        
        if (event.keyCode === 13 || event.which === 13)   {
            ctrlAddItem();
        }
       
        }); 
            
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); 
            
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
        
            
        }
        
        
        
        
        var updateBudget = function()   {
            
            
            
            
            //1. Calculate the budget
            budgetCtrl.calculateBudget();
            
            //2. return the budget
            
            var budget = budgetCtrl.getBudget();
            
            //3. return the budget on the UI
            UICtrl.budgetUi(budget);
        };
        
    
        var updatePercentages = function()  {
            
            // 1. Calculate percentages
            
            budgetCtrl.calculatePercentages();
            
            // 2. Read Percentages from the budget controller
            var percentages = budgetCtrl.getPercentages();
            // 3. Update the UI with the new percentages
            console.log(percentages);
            
            UICtrl.displayPercentages(percentages);
        }
    
    
    
    
    
    
        var ctrlAddItem = function ()   {
        var input, newItem;  
        

        
        // 1. Get the field input data
            
        input = UICtrl.getInput();    
            
        if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){
            
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the item to the UI
        
        UICtrl.addListItem(newItem, input.type);
            
        // 4. Clear input fields    
        UICtrl.clearFields();  
            
       // 5. Calculate Budget and Update budget Display the budget on the UI
        updateBudget(); 
            
        //budgetCtrl.expensePercentage();
        
     // 6. Update percentages
        updatePercentages();
            
            
            
        } else {
            alert("Mete inputs cabronete");
        }
  
 
            
           
         }
        
        var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID, deleteItem;
            
            
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

            
            if (itemID) {
                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);
                
                
                
                console.log(itemID);
                console.log(type);
                console.log(ID);
                
                
                
              
                
                
                // 1. delete the item from the data structure
                
                budgetCtrl.deleteItem(type, ID);
                
                // 2. delete the item from the UI

                UICtrl.deleteItemUI(itemID);

                // 3. update and show the new budget
                updateBudget();
                
               // budgetCtrl.expensePercentage();
                
                // 4. Update percentages
                updatePercentages();
                
            }    
            
        }; 
    
        
        return {
            init: function()    {
                console.log("App has started");
                UICtrl.displayMonth();
                setupEventListener();
                UICtrl.budgetUi({budget:0, 
                                 totalInc:0, 
                                 totalExp:0, 
                                 percentage:0  
                                });
            }
            
        }
    
    
})(budgetController, UIController);

controller.init();