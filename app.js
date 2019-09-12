let btn_add = document.querySelector('#btn-add');
let vc_list = document.getElementById('vc_list');

// =========   UI MODULE   ============

const UIcontroller = (function() {
  let DOMstrings = {
    virtChanelList: 'vc_list'
  };
  return {
    getDOMstring: function() {
      return DOMstrings;
    },
    getInput: function() {
      return {
        // name avail_bw min max expedite pri
        name: document.getElementById('name').value,
        availBw: parseFloat(document.getElementById('avail_bw').value),
        min: parseFloat(document.getElementById('min').value),
        max: parseFloat(document.getElementById('max').value),
        pri: parseFloat(document.getElementById('pri').value),
        exp: parseFloat(document.getElementById('exp').value)
      };
    },
    getEventListners: function() {
      return {
        calcBtn: document.getElementById('btn-calc'),
        btnSetBW: document.getElementById('btn-setbw')
      };
    },
    addListItem: function(vc) {
      let html = `<div id="${vc.id}" class="vc  align-items-center list-group-item">
      <div class="vc_desc">
        <div style="color:#343a40 "> Name : ${vc.name} </div>
        <div style="color:#343a40 "> Min : ${vc.min} </div>
        <div style="color:#343a40 "> Max : ${vc.max} </div>
        <div style="color:#343a40 "> Exp : ${vc.exp} </div>
        <div style="color:#343a40 "> Priority : ${vc.pri}  </div>
        <button style="float-right; margin-right:-50px" id="btn-delete" class="delete btn btn-sm btn-outline-danger">X</button>
        </div>
    </div>`;
      vc_list.insertAdjacentHTML('beforeend', html);
    },
    deleteListItem: function(selectorID) {
      console.log('UI_deletelistItem called ', selectorID);
      let parent = document.getElementById(selectorID).parentNode;
      let el = document.getElementById(selectorID);
      console.log(el);
      console.log(parent);
      parent.removeChild(el);
    },
    validateInput: function(input) {
      if (input.availBw == '') {
        return alert('Please Enter Available Bandwidth');
      } else if (input.name == '') {
        return alert('please enter VC name ');
      }
    },
    clearInput: function() {
      return {
        name: (document.getElementById('name').value = ''),
        // availBw: (document.getElementById('avail_bw').value = ''),
        min: (document.getElementById('min').value = ''),
        max: (document.getElementById('max').value = ''),
        pri: (document.getElementById('pri').value = ''),
        exp: (document.getElementById('exp').value = '')
      };
    }
  };
})();

//==========================     DATA MODULE     ======================

const VC_Controller = (function() {
  let VirtChanel = function(id, name, pri = 0, min = 0, max = 0, exp = 0) {
    this.id = id;
    this.name = name;
    this.pri = pri;
    this.min = min;
    this.max = max;
    this.exp = exp;
  };
  let data = {
    availableBw: 0,
    vc: [],
    priTotal: 0,
    results: []
  };

  const calcPriSum = function() {
    let sum = 0;
    if (data.vc.length > 0) {
      data.vc.forEach(cur => {
        sum = sum + cur.pri;
        data.priTotal = sum;
      });
    }
  };

  //public methods
  return {
    data,
    testing: function() {
      return data;
    },
    addItem: function(name, pri, min, max, exp) {
      //create new id
      let ID;
      if (data.vc.length > 0) {
        ID = data.vc[data.vc.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //check if min max and exp are not underfined
      max = max || 0;
      min = min || 0;
      exp = exp || 0;
      pri = pri || 0;
      //create new item
      let newItem = new VirtChanel(ID, name, pri, min, max, exp);
      //push new item into data structure
      data.vc.push(newItem);
      //Return the new element
      return newItem;
    },

    deleteItem: function(id) {
      let ids, index;

      ids = data.vc.map(item => {
        return item.id;
      });

      index = ids.indexOf(id);

      //remove item if index exists i.e not -1
      if (index !== -1) {
        data.vc.splice(index, 1);
      }
      console.log(data.vc);
    },

    setAvailBW: function(bw) {
      console.log('setting avail bandwidth');
      // let totalmin = 0;
      // data.vc.forEach(item => {
      //   if (item.min > 0) {
      //     totalmin += item.min;
      //   }
      // });
      // data.availableBw = bw - totalmin;
      data.availableBw = bw;
    },
    getAvailableBW: function() {
      return data.availableBw;
    },
    calculateBW: function(avail) {
      //calculate total priority
      calcPriSum();
      data.vc.map(item => {
        let bw = (item.pri / data.priTotal) * avail;
        item.bandwidth = bw.toFixed(2);
        data.results.push(item);
        // data.results.push(item, parseFloat(bw.toFixed(2)));
      });
    }
  };
})();

//Add Button
btn_add.addEventListener('click', () => {
  let inputs, newItem, avBW;
  inputs = UIcontroller.getInput();
  avBW = VC_Controller.getAvailableBW();

  //  add the new item into UI
  if (inputs.name !== '') {
    let totalmin = 0;
    let totalexp = 0;
    if (inputs.min > 0) {
      totalmin += inputs.min;
      avBW = avBW - totalmin;
      VC_Controller.setAvailBW(avBW);
    }
    if (inputs.exp > 0) {
      totalexp += inputs.exp;
      // avBW = VC_Controller.getAvailableBW();
      avBW = avBW - totalexp;
      VC_Controller.setAvailBW(avBW);
    }

    newItem = VC_Controller.addItem(
      inputs.name,
      inputs.pri,
      inputs.min,
      inputs.max,
      inputs.exp
    );

    UIcontroller.addListItem(newItem);
  } else {
    alert('Please Enter VC Name');
  }
  UIcontroller.clearInput();
});

//Calculate Bandwidth
const updateResult = function() {
  let avbw = VC_Controller.getAvailableBW();
  VC_Controller.calculateBW(avbw);
};
//Caclulate button
const UiBtn = UIcontroller.getEventListners();
UiBtn.calcBtn.addEventListener('click', function() {
  updateResult();
  console.log('WORKING!!');
});
//set bandwidth button
const btnSetBandwidth = UIcontroller.getEventListners().btnSetBW;
btnSetBandwidth.addEventListener('click', () => {
  let input = UIcontroller.getInput();
  VC_Controller.setAvailBW(input.availBw);
  // console.log('SETTINGSSSS BANDWIDTH');
});

//============================    APP MODULE   ===========================

const APP_Controler = (function(UIctrl, VCctrl) {
  //Setup event listeners
  const setupEventListeners = function() {
    let DOM = UIctrl.getDOMstring();
    document
      .getElementById(DOM.virtChanelList)
      .addEventListener('click', ctrlDeleteItem);
  };
  const ctrlDeleteItem = function(e) {
    let itemID;
    //get ID of the target's parent Node
    itemID = parseInt(e.target.parentNode.parentNode.id);

    if (itemID >= 0) {
      let idString;
      // 1. Delete item from the data structure

      VCctrl.deleteItem(itemID);
      console.log('deleting item success...');

      // 2. Delete item from the UI
      idString = itemID.toString();
      UIctrl.deleteListItem(idString);
      console.log(typeof idString);

      // 3. update and show result
    }
  };
  return {
    init: function() {
      console.log('THE APPLICATION HAS STARTED');
      setupEventListeners();
    }
  };
})(UIcontroller, VC_Controller);

//INIT
APP_Controler.init();
