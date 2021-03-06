let btn_add = document.querySelector('#btn-add');
let vc_list = document.getElementById('vc_list');

// =========   UI MODULE   ============

const UIcontroller = (function() {
  let DOMstrings = {
    virtChanelList: 'vc_list',
    virtChanelForm: 'VC_form',
    cont_btn: 'btn_continue'
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
      let html = `<div style="  padding: 5px 0px 5px 5px;" id="${vc.id}" class="vc list-group-item">
      <div class="vc_desc">
        <div style="color:#000;  flex-basis: 1;"> Name : ${vc.name} </div>
        <div style="color:#000;  flex-basis: 1;"> Min : ${vc.min} </div>
        <div style="color:#000;  flex-basis: 1;"> Max : ${vc.max} </div>
        <div style="color:#000;  flex-basis: 1;"> Exp : ${vc.exp} </div>
        <div style="color:#000;  flex-basis: 1;"> Priority : ${vc.pri} </div>
        <div>
        <button style=" flex-basis: 1;" id="btn-delete" class="delete btn btn-sm  btn-outline-danger">X
        </button>
        </div>
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
      if (input.availBw === 0) {
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
    },
    toggle_Calc_Button: function(status) {
      let btn = document.getElementById('btn-calc');
      btn.disabled = status;
      console.log('Button to disable:', btn);
    },

    disableForm: function() {
      let f = document.forms['VC_form'].getElementsByTagName('input');
      let s = document.forms['VC_form'].getElementsByTagName('select');
      s[0].disabled = true;
      for (var i = 0; i < f.length; i++) f[i].disabled = true;
    },

    enableForm: function() {
      let f = document.forms['VC_form'].getElementsByTagName('input');
      let s = document.forms['VC_form'].getElementsByTagName('select');
      s[0].disabled = false;
      for (var i = 0; i < f.length; i++) f[i].disabled = false;
    },
    toggle_continue_button: function(id, status) {
      document.getElementById(id).hidden = status;
    },
    //create display result method here...
    displayResult: function(result) {
      let table_data_header = document.getElementById('tableData');
      let html = '';
      result.map(res_item => {
        html = ` <tr>
          <th scope="row">${res_item.id}</th>
          <td>${res_item.name}</td>
          <td>${res_item.min} Mbps</td>
          <td>${res_item.max} Mbps</td>
          <td>${res_item.exp} Mbps</td>
          <td>${res_item.pri}</td>
          <td style="color:green">${res_item.bandwidth} Mbps</td>
          </tr>`;

        table_data_header.insertAdjacentHTML('beforeend', html);
      });
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
      pri = pri || 1;

      //create new item
      let newItem = new VirtChanel(ID, name, pri, min, max, exp);
      //push new item into data structure
      data.vc.push({ ...newItem });
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
        console.log('deleting item from vc array');
        data.results.splice(index, 1);
        console.log('deleting item from results array');
      }
      console.log(data.vc);
    },

    setAvailBW: function(bw) {
      console.log('setting avail bandwidth');
      data.availableBw = bw;
    },
    getAvailableBW: function() {
      return data.availableBw;
    },
    getResult: function() {
      return data.results;
    },
    calculateBW: function(avail) {
      //calculate total priority

      calcPriSum();
      data.vc.map((item, i) => {
        let bw = (item.pri / data.priTotal) * avail;
        item.bandwidth = bw.toFixed(2);

        if (data.results.indexOf(item) === -1) {
          data.results.push(item);
        } else {
          return;
        }
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
    alert('Please Enter The Available Bandwidth');
  }
  UIcontroller.clearInput();
});

//Calculate Bandwidth
const updateResult = function() {
  let avbw = VC_Controller.getAvailableBW();
  VC_Controller.calculateBW(avbw);
  let res = VC_Controller.getResult();
  UIcontroller.displayResult(res);
  UIcontroller.toggle_Calc_Button(true);
  let DOM = UIcontroller.getDOMstring();
  UIcontroller.toggle_continue_button(DOM.cont_btn, false);
};
//Caclulate button
const UiBtn = UIcontroller.getEventListners();
let data = VC_Controller.data.vc;
UiBtn.calcBtn.addEventListener('click', function() {
  if (data.length === 0) {
    return alert('Nothing to calculate. Please add a virtual channel');
  } else {
    updateResult();
  }
  console.log('WORKING!!');
});
//set bandwidth button
const btnSetBandwidth = UIcontroller.getEventListners().btnSetBW;
btnSetBandwidth.addEventListener('click', () => {
  let input = UIcontroller.getInput();
  if (isNaN(input.availBw) || input.availBw === 0) {
    UIcontroller.disableForm();
  } else {
    VC_Controller.setAvailBW(input.availBw);
    UIcontroller.enableForm();
  }

  // console.log('SETTINGSSSS BANDWIDTH');
});

//=========== APP MODULE

const APP_Controler = (function(UIctrl, VCctrl) {
  let DOM = UIctrl.getDOMstring();
  //Setup event listeners
  const setupEventListeners = function() {
    document
      .getElementById(DOM.virtChanelList)
      .addEventListener('click', ctrlDeleteItem);
    document.getElementById(DOM.cont_btn).addEventListener('click', reloadPage);
  };
  const reloadPage = function() {
    window.location.reload(true);
  };
  const ctrlDeleteItem = function(e) {
    let itemID;
    //get ID of the target's parent Node
    itemID = parseInt(e.target.parentNode.parentNode.parentNode.id);

    if (itemID >= 0) {
      let idString;
      // 1. Delete item from the data structure
      VCctrl.deleteItem(itemID);
      if (VCctrl.data.vc.length === 0) {
        UIctrl.toggle_Calc_Button(false);
        UIctrl.toggle_continue_button(DOM.cont_btn, true);
        VCctrl.setAvailBW(0);
        document.getElementById('avail_bw').value = '';
      }
      console.log('deleting item success...');

      // 2. Delete item from the UI
      idString = itemID.toString();
      UIctrl.deleteListItem(idString);

      // 3. update and show result
      let table = document.getElementById('tableData');
      let tablerow = document
        .getElementById('tableData')
        .getElementsByTagName('tr')[idString];

      table.removeChild(tablerow);
    }
  };

  return {
    init: function() {
      console.log('THE APPLICATION HAS STARTED');
      setupEventListeners();
      UIctrl.disableForm();
      UIctrl.toggle_continue_button(DOM.cont_btn, true);

      // UIctrl.enableForm();
    }
  };
})(UIcontroller, VC_Controller);

//INIT
APP_Controler.init();
