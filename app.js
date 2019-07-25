let btn_add = document.querySelector('#btn-add');
let vc_list_item = document.getElementById('vc_list').innerHTML;
const vc_list = document
  .getElementById('wrapper-card')
  .getElementsByTagName('ul')[0];

//VC_Controller
const VC_Controller = (function() {
  let VirtChanel = function(id, name, pri, min, max, exp) {
    this.id = id;
    this.name = name;
    this.pri = pri;
    this.min = min;
    this.max = max;
    this.exp = exp;
  };
  let data = {
    availableBw: 10,
    vc: []
  };
  //public methods
  return {
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
    }
  };
})();

Virtual_Chanels = [
  {
    name: 'P2P',
    priority: 1,
    min: null,
    max: null,
    expedite: null,
    calculatedBW: 0
  },
  {
    name: 'VOIP',
    priority: 2,
    min: null,
    max: null,
    expedite: null,
    calculatedBW: 0
  },
  {
    name: 'Streaming',
    priority: 3,
    min: null,
    max: null,
    expedite: null,
    calculatedBW: 0
  }
];

//UI Controller
const UIcontroller = (function() {
  return {
    getInput: function() {
      return {
        // name avail_bw min max expedite pri
        name: document.getElementById('name').value,
        availBw: document.getElementById('avail_bw').value,
        min: document.getElementById('min').value,
        max: document.getElementById('max').value,
        pri: document.getElementById('pri').value,
        exp: document.getElementById('exp').value
      };
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
  let inputs = UIcontroller.getInput();
  console.log(inputs);
  let addedItem = VC_Controller.addItem(
    inputs.name,
    inputs.pri,
    inputs.min,
    inputs.max,
    inputs.exp
  );
  console.log('added', addedItem);
  UIcontroller.clearInput();

  let li = document.createElement('li');
  li.classList = 'd-flex list-group-item vc-list-item  justify-content-between';
  // !inputs.name ? (li.textContent = none) : (li.textContent = `${inputs.name} `);

  const i = document.createElement('i');
  i.innerHTML = `<span><i id="icon-trash" class="fas fa-trash"></i></span>`;
  li.classList = 'list-group-item d-flex  vc-list-item justify-content-between';
  li.appendChild(i);
  vc_list.appendChild(li);

  console.log(Virtual_Chanels);

  i.addEventListener('click', e => {
    let el = e.target.parentNode.parentNode.parentElement;
    let parent = vc_list;
    parent.removeChild(el);
  });

  console.log(bandwidth(sum, Avail_BW));
  // console.log(Virtual_Chanels);
});

// let Avail_BW = 10;
//   const sum = Virtual_Chanels.reduce((acc, vc) => {
//     let total_pri = vc.priority + acc;
//     return total_pri;
//   }, 0);

//   const bandwidth = (sum_of_pri, avail_bw) => {
//     Virtual_Chanels.map(vc => {
//       let result = (vc.priority / sum_of_pri) * avail_bw;
//       vc.calculatedBW = result;
//       console.log(`${vc.name}: bandwidth: ${vc.calculatedBW.toFixed(2)}`);
//     });
//   };
