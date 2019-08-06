let btn_add = document.querySelector('#btn-add');
let vc_list_item = document.getElementById('vc_list').innerHTML;
const vc_list = document
  .getElementById('wrapper-card')
  .getElementsByTagName('ul')[0];

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
    availableBw: 10,
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
    testing: function() {
      return data;
    },
    calculateBW: function() {
      //calculate total priority
      calcPriSum();
      //calculate BW usingformular
      data.vc.map(item => {
        let bw = (item.pri / data.priTotal) * data.availableBw;
        data.results.push(bw.toFixed(2));
      });
    },
    addItem: function(name, pri, min, max, exp) {
      //create new id
      let ID = data.vc.length + 1;
      //create new item
      let newItem = new VirtChanel(ID, name, pri, min, max, exp);
      //push new item into data structure
      data.vc.push(newItem);
      //Return the new element
      console.log(data.vc);
      return newItem;
    },
    setAvailBW: function(bw) {
      data.vc.forEach(item => {
        if (item.min > 0) {
          data.availableBw = bw - item.min;
        } else {
          data.availableBw = bw;
        }
      });
    },
    getAvailableBW: function() {
      return data.availableBw;
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
        calcBtn: document.getElementById('btn-calc')
      };
    },
    addListItem: function(obj) {
      let html = `<li
      class="vc d-flex justify-content-between align-items-center list-group-item"
    >
      <div class="vc__name">${obj.name}</div>
      <div class="vc__delete">
        <button class="btn btn-sm btn-outline-danger">
          X
        </button>
      </div>
    </li>`;
      vc_list.insertAdjacentHTML('beforeend', html);
    },
    validateInput: function(input) {
      if (input.name == '') {
        return alert('please enter VC name');
      } else if (input.availBw == '' || isNaN(input.availBw)) {
        return alert('Please enter Avail BW');
      }
    },
    clearInput: function() {
      return {
        name: (document.getElementById('name').value = ''),
        availBw: (document.getElementById('avail_bw').value = ''),
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
  if (inputs.name !== '' && !isNaN(inputs.availBw) && inputs.availBw > 0) {
    newItem = VC_Controller.addItem(
      inputs.name,
      inputs.pri,
      inputs.min,
      inputs.max,
      inputs.exp
    );
    //set the available bandwidth
    VC_Controller.setAvailBW(inputs.availBw);

    UIcontroller.addListItem(newItem);
  } else {
    alert('Please Enter VC Name');
  }

  UIcontroller.clearInput();
});

//Calculate Bandwidth
const updateResult = function() {
  //calculate total priority of all vc
  let res = VC_Controller.calculateBW();
  console.log(res);
  //check if min max and exp
  //calculate bandwidth using formular
  //return calculated BW
  //Update UI table with the result
};
const UiBtn = UIcontroller.getEventListners();
UiBtn.calcBtn.addEventListener('click', function() {
  updateResult();
  console.log('WORKING!!');
});

//   const bandwidth = (sum_of_pri, avail_bw) => {
//     Virtual_Chanels.map(vc => {
//       let result = (vc.priority / sum_of_pri) * avail_bw;
//       vc.calculatedBW = result;
//       console.log(`${vc.name}: bandwidth: ${vc.calculatedBW.toFixed(2)}`);
//     });
//   };
