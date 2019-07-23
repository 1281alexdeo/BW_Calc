let btn_add = document.querySelector('#btn-add');
// let vc_list_item = document.getElementById('vc_list').innerHTML;
const vc_list = document
  .getElementById('wrapper-card')
  .getElementsByTagName('ul')[0];

Virtual_Chanels = [
  {
    name: 'P2P',
    priority: 1,
    min: null,
    max: null,
    expedite: null
  },
  {
    name: 'VOIP',
    priority: 2,
    min: null,
    max: null,
    expedite: null
  },
  {
    name: 'Streaming',
    priority: 3,
    min: null,
    max: null,
    expedite: null
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

    clearInputs: function() {
      document.getElementById('name').value = '';
      document.getElementById('avail_bw').value = '';
      document.getElementById('min').value = '';
      document.getElementById('max').value = '';
      document.getElementById('pri').value = '';
      document.getElementById('exp').value = '';
    }
  };
})();

const createListItem = prop => {
  if (prop.name == '') {
    return '';
  } else {
    let li = document.createElement('li');
    li.classList =
      'd-flex list-group-item vc-list-item  justify-content-between';
    li.textContent = `${prop.name} `;
    const i = document.createElement('i');
    i.innerHTML = `<span><i id="icon-trash" class="fas fa-trash"></i></span>`;
    li.classList =
      'list-group-item d-flex  vc-list-item justify-content-between';
    li.appendChild(i);
    vc_list.appendChild(li);
    return {
      i
    };
  }
};

//Add Button
btn_add.addEventListener('click', e => {
  e.preventDefault();
  let inputs = UIcontroller.getInput();

  let { i } = createListItem(inputs);
  i.addEventListener('click', e => {
    let el = e.target.parentNode.parentNode.parentElement;
    let parent = vc_list;
    parent.removeChild(el);
  });
  console.log(inputs);
  //clear inputs
  UIcontroller.clearInputs();
});

//Caclulations
let Avail_BW = 10;
const sum = Virtual_Chanels.reduce((acc, vc) => {
  let total_pri = vc.priority + acc;
  return total_pri;
}, 0);

const bandwidth = (sum_of_pri, avail_bw) => {
  Virtual_Chanels.map(vc => {
    let result = (vc.priority / sum_of_pri) * avail_bw;
    console.log(`${vc.name}: bandwidth: ${result.toFixed(2)}`);
  });
};

console.log(bandwidth(sum, Avail_BW));