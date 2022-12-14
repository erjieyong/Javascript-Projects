var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.returnPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      //create new ID
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      //Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //push it into our data structure
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var idList, index;
      idList = data.allItems[type].map(function (cur) {
        return cur.id;
      });

      index = idList.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      //calculate income and expense total
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate budget total
      data.budget = data.totals.inc - data.totals.exp;
      //calculate percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calculatePercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.allItems.exp.map(function (cur) {
        return cur.percentage;
      });
      return allPercentages;
    },

    getBudget: function () {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var formatNumber = function (num, type) {
    var splitNum, int, dec;
    num = Math.abs(num);
    //change the number to always display at 2 decimal point
    num = num.toFixed(2);
    //change to have a comma on the first 3 digit
    splitNum = num.split(".");
    int = splitNum[0];
    dec = splitNum[1];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    //add a + or - for different type
    return (int = (type === "exp" ? "-" : "+") + " " + int + "." + dec);
  };

  //learning to create your own forEach statement!!!
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if ((type = "exp")) {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      //insert html into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");
      if (obj.totalInc > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      var expPercentages = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );

      nodeListForEach(expPercentages, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });

      /*The above foreach statement is useful when you are using it multiple times! But if you only use it one time, can just use the below. The reason we are doing a new ForEach statement is because the ForEach Method is not available for a nodelist.
      for (var i = 0; i < expPercentages.length; i++) {
        expPercentages[i].textContent=percentages[i] + "%";
      }
      */
    },

    displayDate: function () {
      var now, months, month, year;
      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },

    changedType: function () {
      var fields;
      fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );

      nodeListForEach(fields,function(cur){
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    },

    getDOMStrings: function () {
      return DOMstrings;
    },
  };
})();

var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListener = function () {
    var DOMstrings = UICtrl.getDOMStrings();
    //to listen to a mouse click on the tick button
    document
      .querySelector(DOMstrings.inputButton)
      .addEventListener("click", ctrlAddItem);
    //to listen to a keyboard Enter on the tick button
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    //to listen to a mouse click on the delete button next to the line items
    document
      .querySelector(DOMstrings.container)
      .addEventListener("click", ctrlDeleteItem);
    //to listen to a change in the input type for the + and -
    document
      .querySelector(DOMstrings.inputType)
      .addEventListener("change", UICtrl.changedType);
  };

  var updateBudget = function () {
    //1. calculate the budget
    budgetCtrl.calculateBudget();
    //2. return the budget
    var budget = budgetCtrl.getBudget();
    //3. display the budget on the UI
    UIController.displayBudget(budget);
  };

  var updatePercentages = function () {
    //1. Calculate the percentage
    budgetCtrl.calculatePercentages();
    //2.return the percentages
    var allPercentages = budgetCtrl.getPercentages();
    //3.display the percentage in the UI
    UICtrl.displayPercentages(allPercentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    //1. get the field input data
    input = UICtrl.getInput();

    if (input.description && input.value > 0 && input.value !== NaN) {
      //2. add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. clear the fields
      UICtrl.clearFields();

      //5. calculate and update budget
      updateBudget();

      //6. calculate and update percentage
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, id;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      id = parseInt(splitID[1]);

      //1.delete item from data structure
      budgetCtrl.deleteItem(type, id);
      //2.delete item from UI
      UICtrl.deleteListItem(itemID);
      //3.update and show the new budget
      updateBudget();
      //4. calculate and update percentage
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started.");
      UICtrl.displayDate();
      UICtrl.displayBudget({
        totalInc: 0,
        totalExp: 0,
        budget: 0,
        percentage: -1,
      });
      setupEventListener();
    },
  };
})(budgetController, UIController);

controller.init();
