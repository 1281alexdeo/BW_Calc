let btn_add = document.querySelector('#btn-add');
let vc_list_item = document.getElementById('vc_list');
// const vc_list = document
//   .getElementById('wrapper-card')
//   .getElementsByTagName('ul')[0];

vc_list.addEventListener('click', function(e) {
  if (e.target.className == 'delete') {
    const li = e.target.parentElement;
    vc_list.removeChild(li);
  }
});

//========    VC_Controller   ============
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
      let ID = data.vc.length + 1;
      //check if min max and exp are not underfined
      max = max || 0;
      min = min || 0;
      exp = exp || 0;
      pri = pri || 'BE';
      //create new item
      let newItem = new VirtChanel(ID, name, pri, min, max, exp);
      //push new item into data structure
      data.vc.push(newItem);
      //Return the new element
      return newItem;
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
        data.results.push(parseFloat(bw.toFixed(2)));
      });
    }
  };
})();

//=========   UI Controller   ============
const UIcontroller = (function() {
  return {
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
      let html = `<li
      class="vc d-flex justify-content-between align-items-center list-group-item"
    >
      <div class="vc__name">${vc.name} | ${vc.min} |${vc.max}| ${vc.exp}|${vc.pri}</div>
      <div class="vc__delete">
        <button id="btn_vc_delete" class="btn btn-sm btn-outline-danger delete">
          X
        </button>
      </div>
    </li>`;
      vc_list.insertAdjacentHTML('beforeend', html);
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

//Add Button
btn_add.addEventListener('click', () => {
  let inputs, newItem;
  inputs = UIcontroller.getInput();

  //  add the new item into UI
  if (inputs.name !== '') {
    let totalmin = 0;
    if (inputs.min > 0) {
      totalmin += inputs.min;
    }
    avBW = VC_Controller.getAvailableBW();
    avBW = avBW - totalmin;
    VC_Controller.setAvailBW(avBW);

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
