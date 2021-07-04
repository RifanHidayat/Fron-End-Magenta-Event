import {React} from 'react'
function Menu(){
    return(
        <div class="pills-regular">
            <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">
                <li class="nav-item">
                <button class="nav-link" > Anggota</button>
                 </li>&ensp;
                <li class="nav-item">
                <button class="nav-link" > Anggaran</button>
        </li>&ensp;

        <li class="nav-item" id="payslip">
        <button class="nav-link" > Task</button>
        </li>&ensp;
        <li class="nav-item" id="payslip" >
           <button class="nav-link" > Persetujuan</button>
        </li>&ensp;
    </ul>
    </div>

    );


}

export default Menu;