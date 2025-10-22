const form = document.getElementById('todoForm');
const tableBody = document.querySelector('#todoTable tbody');
const downloadBtn = document.getElementById('downloadBtn');
const animatedTitle = document.getElementById('animated-title');
const bottomBar = document.getElementById('bottomBar');
const textToType = "SM High Tech Industrial Engineering Care"; 

let entries = JSON.parse(localStorage.getItem('todoEntries')) || [];
let editIndex = -1; 

// --- Typing Animation Script ---
function typeText(element, text) {
    let index = 0;
    element.textContent = ''; 
    
    // Check for mobile to disable character-by-character typing
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    function animate() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(animate, 100); 
        }
    }
    
    if(isMobile) {
        // For mobile, just set the full text immediately
        element.textContent = text;
    } else {
        // For desktop, run the character-by-character animation
        animate();
    }
}

// --- Local Storage Functions ---
function saveEntries() {
    localStorage.setItem('todoEntries', JSON.stringify(entries));
}

function createRowHTML(data){
  return `
    <td data-label="Your Name">${data.name}</td>
    <td data-label="Your Polytechnic">${data.polytechnic}</td>
    <td data-label="Class Date">${data.date}</td>
    <td data-label="Class No.">${data.classNo}</td>
    <td data-label="Class Tools Used">${data.tools}</td>
    <td data-label="Class Work Details">${data.workDetails}</td>
    <td data-label="Remarks">${data.remarks}</td>
    <td data-label="Actions">
      <button class="action-btn edit-btn">Edit</button>
      <button class="action-btn delete-btn">Delete</button>
    </td>
  `;
}

function loadEntries() {
    tableBody.innerHTML = ''; 
    entries.forEach((data, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index; 
        row.innerHTML = createRowHTML(data);
        tableBody.appendChild(row);
    });
}

// --- Event Handlers ---
form.addEventListener('submit', function(e){
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        polytechnic: document.getElementById('polytechnic').value,
        classNo: document.getElementById('classNo').value,
        date: document.getElementById('date').value,
        tools: document.getElementById('tools').value,
        workDetails: document.getElementById('workDetails').value,
        remarks: document.getElementById('remarks').value,
    };

    if(editIndex > -1){
        entries[editIndex] = data;
        editIndex = -1;
        document.querySelector('button[type="submit"]').textContent = 'Submit';
    } else {
        entries.push(data);
    }

    saveEntries(); 
    loadEntries(); 
    form.reset();
});

tableBody.addEventListener('click', function(e){
    const row = e.target.closest('tr');
    if (!row) return;

    const rowIndex = parseInt(row.dataset.index);
    const rowData = entries[rowIndex];

    if(e.target.classList.contains('edit-btn')){
        editIndex = rowIndex;
        document.querySelector('button[type="submit"]').textContent = 'Update';

        document.getElementById('name').value = rowData.name;
        document.getElementById('polytechnic').value = rowData.polytechnic;
        document.getElementById('classNo').value = rowData.classNo;
        document.getElementById('date').value = rowData.date;
        document.getElementById('tools').value = rowData.tools;
        document.getElementById('workDetails').value = rowData.workDetails;
        document.getElementById('remarks').value = rowData.remarks;
        
    } else if(e.target.classList.contains('delete-btn')){
        if(confirm('Are you sure you want to delete this entry?')){
            entries.splice(rowIndex, 1);
            saveEntries();
            loadEntries();
            
            if(editIndex === rowIndex) {
                editIndex = -1;
                document.querySelector('button[type="submit"]').textContent = 'Submit';
            }
        }
    }
});

downloadBtn.addEventListener('click', function(){
    let csv = [];
    const header = Array.from(document.querySelectorAll('#todoTable thead th'))
                        .map(th => `"${th.innerText.trim()}"`);
    csv.push(header.slice(0, -1).join(',')); 

    entries.forEach(data => {
        const rowData = [
            `"${data.name}"`, 
            `"${data.polytechnic}"`, 
            `"${data.date}"`, 
            `"${data.classNo}"`, 
            `"${data.tools}"`, 
            `"${data.workDetails.replace(/"/g, '""')}"`, 
            `"${data.remarks}"`
        ];
        csv.push(rowData.join(','));
    });

    const csvFile = new Blob([csv.join('\n')], {type:'text/csv'});
    const downloadLink = document.createElement('a');
    downloadLink.download = 'ToDo_List.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display='none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// --- Initialization ---
window.addEventListener('load', () => {
    typeText(animatedTitle, textToType);

    // Animate the bottom bar after a slight delay
    setTimeout(() => {
        bottomBar.classList.add('show');
    }, 500); 
    
    loadEntries();
});

