
const draggbles = document.querySelectorAll(".shallow-draggable")
const containers = document.querySelectorAll(".draggable-container")

draggbles.forEach((draggble) => {
  //for start dragging costing opacity
  draggble.addEventListener("dragstart", () => {
    draggble.classList.add("dragging")
  })

  //for end the dragging opacity costing
  draggble.addEventListener("dragend", () => {
    draggble.classList.remove("dragging")
  })
})
//shit
containers.forEach((container) => {
  container.addEventListener("dragover", function (e) {
    e.preventDefault()
    const afterElement = dragAfterElement(container, e.clientY)
    const dragging = document.querySelector(".dragging")
    if (afterElement == null) {
      container.appendChild(dragging)
    } else {
      container.insertBefore(dragging, afterElement)
    }
  })
})

function dragAfterElement(container, y) {
  const draggbleElements = [...container.querySelectorAll(".shallow-draggable:not(.dragging)")]

  return draggbleElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
//เพิ่ม subprocess
$(document).on( "click",".addsubprocess", function() {

  // alert( "Handler for `click` called." );
  let s_job = $('#s_job').val();
  let e_job = $('#e_job').val();
  let s_sub_date = $('#s_sub_date').val();
  let e_sub_date = $('#e_sub_date').val();
  let sub_process = $('#subprocessinput').val();
  let job_id = $('#job_id').val();
  let process_id = $('#process_id').val();
  if(s_sub_date<s_job||s_sub_date>e_job){
    alert('โปรดตรวจสอบวันที่เริ่มต้น');
    return false;
  }
  if(e_sub_date<s_job||s_sub_date>e_job){
    alert('โปรดตรวจสอบวันที่สิ้นสุด');
    return false;
  }
  $.ajax(
    {
      
    url: "/addsubprocess",
    type: "post",
    dataType: 'text',
    data: { job_id : job_id,process_id : process_id, sub_process: sub_process,s_sub_date : s_sub_date ,e_sub_date : e_sub_date},
    success: function (data) {

     alert('บันทึกสำเร็จ');
     
      showsubprocess();       
    
    }
});   
} );
//
  $(document).ready(function() {
    $('#urladdprocess').hide();
//ปฏิทิน
  $('#s_date,#e_date,#job_start,#job_end,.create-s-date,.create-e-date,#editjob_start,#editjob_end').datepicker({
    language:'th',
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    todayHighlight: true,
    autoclose: true
  });
  const pathname = window.location.pathname;
  const text = pathname.split("/");
  // alert(text[1]);

  // return false;
  if(text[1] = 'formupdateprocess'){
  showsubprocess();
  }
});

// โชว subprocess
function showsubprocess(){
  const process_id = $('#process_id').val();
  $.ajax(
    {
      
    url: "/showsubprocess",
    type: "get",
    dataType: 'text',
    data: { process_id : process_id},
    success: function (data) {
      let a = JSON.parse(data);
      // console.log(a)   
      $('#subprocess_id').val(data.subprocess_id);
    }
});  
  $('#processitem').html('');
        
  // $('#addjob_id').html('');
  // $('#addjob_id').append('<input class="addprocessid" type="text" value="'+a.process[0]['job_id']+'">');
  $("#urladdprocess").attr("href", "/formprocess/"+a.process[0]['job_id']+""); 
   
  a.process.forEach(element => {
   
      $('#processitem').append('<li id="process'+element.process_id+'" class="list-group-item  process_list ">'+
      '&nbsp; ชื่อ: ' + element.process_name +'<br>&nbsp; วันที่เริ่ม: '+ element.process_start +'<br>&nbsp; วันที่สิ้นสุด :'+ element.process_end +'<br>'+
      '<div class="text-right">'+
      '<button class="btn btn-warning editsubprocess" type="button" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">'+ '<i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'+
      '&nbsp;&nbsp;<button class="btn btn-success" onclick="confirmprocess('+element.process_id+')" title="จบขั้นตอนการทำงาน"><i class="fa fa-check-circle" aria-hidden="true"></i></button>'+
      '&nbsp;&nbsp;<button class="btn btn-danger" onclick="deleteprocess('+element.process_id+')" title="ลบ"><i class="fa fa-window-close" aria-hidden="true"></i></button>'+
      '</div>'+
      '</li>'
      );
  });
 
}

function jobText(id, element){
    console.log('in Function('+id+')');
    $('#'+id).append('<ul style="padding-bottom: 2px;" class="list-group">'+
          '<li class="list-group-item "> '+
          '<div class="row">'+
          '<div class="col-8">'+
            element.job_name+
          '<br> วันที่เริ่ม :'+ element.job_start + '<br> วันที่สิ้นสุด :'+ element.job_end +
          '<br> '+ ((+element.dateremain<0)?'ล่าช้ามาแล้ว :'+(element.dateremain*-1):'วันคงเหลือก่อนครบกำหนด :'+element.dateremain) +'วัน' +
          '</div>'+
          '<div class="col-4" class="text-right">'+
            '<button class="btn btn-warning" onclick="updatejobform('+ element.job_id + ')">'+
                '<i class="fa fa-pencil " aria-hidden="true" ></i> '+
              '</button>'+
              '<a href="/showjobselect/'+element.job_id+'" class="btn btn-success">'+
                '<i class="fa fa-eye" aria-hidden="true" ></i>'+
              '</a>'+
              '<button class="btn btn-danger" onclick="deletejob('+ element.job_id + ')">'+
              '<i class="fa fa-trash" aria-hidden="true"></i></i> '+
              '</button>'+
          '</div>'+
        '</li>'+
    '</ul>'
    );
}

//เลือก หน่วยงาน แสดง job
$(document).on( "change",".selectdivision", function() {
  $( "select option:selected" ).each( function() {
    divid = $(this).val();
  } );
  // $('#urladdprocess').hide();
  showjobselect(divid)    

} );
// show job หลังจากเลือกหน่วยงาน
function showjobselect(divid){
  $('#urladdjob').show();
  $.ajax(
    {
      url: "/showafterdiv",
      type: "get",
      dataType: 'text',
      data: { divisionid1: divid},
    success: function (data) {
      // location.reload();
      let showdata = JSON.parse(data);
      console.log(showdata.job)
      $('#mustact,#inprogress,#waitapprove,#approve').html('');
      // $('#finishjobitem').html('');
      if(showdata.job != 0){
      showdata.job.forEach(element => {
      if(element.status == '1'){
        jobText('mustact', element);
      }
      if(element.status == '2'){
        jobText('inprogress', element);
      }
      if(element.status == '3'){
        jobText('waitapprove', element);
      }
      if(element.status == '4'){
        $('#approve').append('<ul style="padding-bottom: 2px;" class="list-group">'+
            '<li class="list-group-item "> '+
            '<div class="row">'+
            '<div class="col-8">'+
              element.job_name+
            '<br> วันที่เริ่ม :'+ element.job_start + '<br> วันที่สิ้นสุด :'+ element.job_end +
            '</div>'+
            '<div class="col-4" class="text-right">'+
              '<button class="btn btn-warning" onclick="updatejobform('+ element.job_id + ')">'+
                  '<i class="fa fa-pencil " aria-hidden="true" ></i> '+
                '</button>'+
                '<a href="/showjobselect/'+element.job_id+'" class="btn btn-success">'+
                  '<i class="fa fa-eye" aria-hidden="true" ></i>'+
                '</a>'+
                '<button class="btn btn-danger" onclick="deletejob('+ element.job_id + ')">'+
                '<i class="fa fa-trash" aria-hidden="true"></i></i> '+
                '</button>'+
            '</div>'+
          '</li>'+
      '</ul>'
      
        );
      }
        
    });
  }
  else{
    alert('ไม่พบ');
  }
      
    }
});   
}

//เลือก job แสดง process

function jobselect(jobid){
  $('#urladdprocess').show();
  $.ajax(
    {
      
    url: "/home/get",
    type: "post",
    dataType: 'text',
    data: { jobid1: jobid},
    success: function (data) {
      var a = JSON.parse(data);
      console.log(a.process)
     
      $('#processitem').html('');
      $('#finishprocessitem').html('');
      
      // $('#addjob_id').html('');
      // $('#addjob_id').append('<input class="addprocessid" type="text" value="'+a.process[0]['job_id']+'">');
      $("#urladdprocess").attr("href", "/formprocess/"+a.process[0]['job_id']+""); 
       
      a.process.forEach(element => {
       
          $('#processitem').append('<li id="process'+element.process_id+'" class="list-group-item  process_list ">'+
          '&nbsp; ชื่อ: ' + element.process_name +'<br>&nbsp; วันที่เริ่ม: '+ element.process_start +'<br>&nbsp; วันที่สิ้นสุด :'+ element.process_end +'<br>'+
          '<div class="text-right">'+
          '<a class="btn btn-warning" href="/formupdateprocess/'+element.process_id+'" title="แก้ไข">'+ '<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'+
          '&nbsp;&nbsp;<button class="btn btn-success" onclick="confirmprocess('+element.process_id+')" title="จบขั้นตอนการทำงาน"><i class="fa fa-check-circle" aria-hidden="true"></i></button>'+
          '&nbsp;&nbsp;<button class="btn btn-danger" onclick="deleteprocess('+element.process_id+')" title="ลบ"><i class="fa fa-window-close" aria-hidden="true"></i></button>'+
          '</div>'+
          '</li>'
          
          
          );
          
      });
      a.processfinish.forEach(element => {
       
        $('#finishprocessitem').append('<li id="process'+element.process_id+'" class="list-group-item  process_list ">'+
        '&nbsp; ชื่อ: ' + element.process_name +'<br>&nbsp; วันที่เริ่ม: '+ element.process_start +'<br>&nbsp; วันที่สิ้นสุด :'+ element.process_end +'<br>'+
        '<div class="text-right">'+
        '<a class="btn btn-success" href="/formupdateprocess/'+element.process_id+' " title="ดูข้อมูล">'+ '<i class="fa fa-search" aria-hidden="true"></i></a>'+
        '</div>'+
        '</li>'
        
        );
        
    });
      
    }
});   
}

// โชว subprocess
function showsubprocess(){
  const process_id = $('#process_id').val();
  $.ajax(
    {
      
    url: "/showsubprocess",
    type: "get",
    dataType: 'text',
    data: { process_id : process_id},
    success: function (data) {
      let a = JSON.parse(data);
      // console.log(a)   
      $('#subprocess_id').val(data.subprocess_id);
    }
});  
  $('#processitem').html('');
        
  // $('#addjob_id').html('');
  // $('#addjob_id').append('<input class="addprocessid" type="text" value="'+a.process[0]['job_id']+'">');
  $("#urladdprocess").attr("href", "/formprocess/"+a.process[0]['job_id']+""); 
   
  a.process.forEach(element => {
   
      $('#processitem').append('<li id="process'+element.process_id+'" class="list-group-item  process_list ">'+
      '&nbsp; ชื่อ: ' + element.process_name +'<br>&nbsp; วันที่เริ่ม: '+ element.process_start +'<br>&nbsp; วันที่สิ้นสุด :'+ element.process_end +'<br>'+
      '<div class="text-right">'+
      '<button class="btn btn-warning editsubprocess" type="button" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">'+ '<i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'+
      '&nbsp;&nbsp;<button class="btn btn-success" onclick="confirmprocess('+element.process_id+')" title="จบขั้นตอนการทำงาน"><i class="fa fa-check-circle" aria-hidden="true"></i></button>'+
      '&nbsp;&nbsp;<button class="btn btn-danger" onclick="deleteprocess('+element.process_id+')" title="ลบ"><i class="fa fa-window-close" aria-hidden="true"></i></button>'+
      '</div>'+
      '</li>'
      );
  });
 
}


// ลบขั้นตอนการทำงาน
function deleteprocess(process_id){
  let text = "ยืนยันการลบข้อมูล";
  if (confirm(text) == true) {
    text = "ทำการลบข้อมูลแล้ว";
    alert(text);
    // window.location.reload(false);
    // return false;
    $.ajax(
      {
      url: "deleteprocess/"+process_id,
      type: "post",
      dataType: 'text',
      // data: { process_id: process_id},
      success: function (data) {
       
        window.location.reload(false);
      }
  });   
  } 
  
}

function confirmprocess(process_id){
  let text = "ยืนยันการสิ้นสุดการทำงาน";
  if (confirm(text) == true) {
    text = "ทำการยืนยันข้อมูลแล้ว";
    alert(text);
    // window.location.reload(false);
    // return false;
    $.ajax(
      {
      url: "confirmprocess/"+process_id,
      type: "post",
      dataType: 'text',
      // data: { process_id: process_id},
      success: function (data) {
       
        window.location.reload(false);
      }
  });   
  } 
}
// เพิ่มขั้นตอนการทำงาน
$(document).on("click",".insertprocess",function(){
  let job_id = $('#job_id').val();
  let process_name = $('#process_name').val();
  let processstart = $('#s_date').val();
  let processend = $('#e_date').val();
  let detail = $('#detail').val();
  
  var p_s_start = processstart.split('/');
  let rs_start = p_s_start[2]+'-'+p_s_start[1]+'-'+p_s_start[0];
  var p_s_end= processend.split('/');
  let rs_end = p_s_end[2]+'-'+p_s_end[1]+'-'+p_s_end[0];
  // alert(rs_start);
  // alert(rs_end);
  let s_job = $('#s_job').val();
  let e_job = $('#e_job').val();
  if(rs_end < rs_start){
    alert('วันที่ สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น');
    
  }
 
  if(process_name ==''){
    alert('กรุณากรอก ขั้นตอน');
    process_name.focus();
    return false;
  }else if(processstart == ''){
    alert('กรุณากรอกวันที่เริ่มต้น');
    processstart.focus();
    return false;
  }else if(processend == ''){
    alert('กรุณากรอกวันที่สิ้นสุด');
    processend.focus();
    return false;
  }

  $.ajax(
    {
    url: "/insertprocess",
    type: "post",
    dataType: 'text',
    data: {job_id : job_id, process_name : process_name,process_start : rs_start, process_end : rs_end,detail : detail} ,
    success: function (data) {
      
      const obj = JSON.parse(data);
      console.log(obj);
      location.replace("/formupdateprocess/"+obj.process)
    }
});   
});

//เพิ่มขั้นตอนการทำงาน
// แก้ไขขั้นตอนการทำงาน
$(document).on("click",".updateprocess",function(){
  // let job_idprocess = $('.addprocessid').val();
  console.log( $('#formaddprocess').serialize() );
  // return false;
  let job_id = $('#job_id').val();
  let process_name = $('#process_name').val();
  let processstart = $('#s_date').val();
  let processend = $('#e_date').val();
  let detail = $('#detail').val();
  // alert(processstart);
  // alert(processend);
  
  var p_s_start = processstart.split('/');
  let rs_start = p_s_start[2]+'-'+p_s_start[1]+'-'+p_s_start[0];
  var p_s_end= processend.split('/');
  let rs_end = p_s_end[2]+'-'+p_s_end[1]+'-'+p_s_end[0];
  // alert(rs_start);
  // alert(rs_end);
  let s_job = $('#s_job').val();
  let e_job = $('#e_job').val();
  if(rs_end < rs_start){
    alert('วันที่ สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น');
    
  }
 
//   alert(rs_end-rs_start);
// return false;
  if(process_name ==''){
    alert('กรุณากรอก ขั้นตอน');
    process_name.focus();
    return false;
  }else if(processstart == ''){
    alert('กรุณากรอกวันที่เริ่มต้น');
    processstart.focus();
    return false;
  }else if(processend == ''){
    alert('กรุณากรอกวันที่สิ้นสุด');
    processend.focus();
    return false;
  }

  $.ajax(
    {
    url: "/updateprocess",
    type: "post",
    dataType: 'text',
    data: $('#formaddprocess').serialize() ,
    success: function (data) {
        alert('บันทึก');
        window.location.reload();
    }
});   
});
// แก้ไขขั้นตอนการทำงาน
// addjob
function addjob(){
  let jobname = $('#job_name').val();
  let jobstart = $('#job_start').val();
  let jobend = $('#job_end').val();
  var arr1 = jobstart.split('/');
  let jstart = arr1[2]+'-'+arr1[1]+'-'+arr1[0];
  var arr2 = jobend.split('/');
  let jend = arr2[2]+'-'+arr2[1]+'-'+arr2[0];  
  var name = document.getElementById("job_name");
  var start = document.getElementById("job_start");
  var end = document.getElementById("job_end");
  if( name.value == "") {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      name.focus();
      return false;
  }else if (start.value ==""){
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      start.focus();
      return false;
  }else if (end.value == "" ){
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      end.focus();
      return false;
  }else if (jend < jstart){
    alert("กรุณากรอกข้อมูลวันที่ให้ถูกต้อง")
    return false;
  }
  
  $.ajax(
    {
    url: "addjob",
    type: "post",
    dataType: 'text',
    data: { jobname: jobname,jobstart: jstart,jobend: jend},
    success: function (data) {
      alert('บันทึก')
      window.location.reload(false);
    }
});   
}

// editjob
function editjob(){
  let editjob_id = $('#editjob_id').val();
  let editjobname = $('#editjob_name').val();
  let editjobstart = $('#editjob_start').val();
  let editjobend = $('#editjob_end').val();
  var arr1 = editjobstart.split('/');
  let editjstart = arr1[2]+'-'+arr1[1]+'-'+arr1[0];
  var arr2 = editjobend.split('/');
  let editjend = arr2[2]+'-'+arr2[1]+'-'+arr2[0];  
  var editname = document.getElementById("editjob_name");
  var editstart = document.getElementById("editjob_start");
  var editend = document.getElementById("editjob_end");
  if( editname.value == "") {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      editname.focus();
      return false;
  }else if (editstart.value ==""){
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
    editstart.focus();
      return false;
  }else if (editend.value == "" ){
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
    editend.focus();
      return false;
  }else if (editjend < editjstart){
    alert("กรุณากรอกข้อมูลวันที่ให้ถูกต้อง")
    return false;
  }
  
  $.ajax(
    {
    url: "editjob",
    type: "post",
    dataType: 'text',
    data: { editjobid: editjob_id,editjobname: editjobname,editjobstart: editjstart,editjobend: editjend},
    success: function (data) {
      alert('บันทึก')
      window.location.reload(false);
    }
});   
}

function updatejobform(jobid){
  $.ajax(
    {
    url: "../updatejobform",
    type: "post",
    dataType: "json",
    data: { jobid: jobid},
    success: function (data) {
      $('#myModaledit').modal('show');
      console.log(data);
      $("#editjob_id").val(data.job_id);
      $("#editjob_name").val(data.job_name);
      $("#editjob_start").val(data.job_start);
      $("#editjob_end").val(data.job_end);
    }
});   
}

//ลบหัวข้อ job
function deletejob(job_id){
  let text = "ยืนยันการลบข้อมูล";
  if (confirm(text) == true) {
    text = "ทำการลบข้อมูลแล้ว";
    alert(text);

      $.ajax({
      url: "deletejob",
      type: "POST",
      dataType: 'text',
      data: { job_id: job_id},
      success: function (data) {
            alert('ลบข้อมูลเรียบร้อย')
            window.location.reload();
          }
      });
  }
};
$(document).on('click','.formaddsubprocess',function(){
  $('.addsubprocess').show();
  $('.updatesubprocess').hide();
});
function editsubprocess(subprocessid){
  
  $.ajax(
    {
    url: "/editsubprocess",
    type: "get",
    dataType: "json",
    data: { subprocess_id: subprocessid},
      success: function (data) {
        
        $('#exampleModalToggle').modal('show');
        $('.addsubprocess').hide();
  
        $("#sub_id").val(data.subprocess_id);
        $("#subprocessinput").val(data.subprocess_name);
        $("#s_sub_date").val(data.subprocess_start);
        $("#e_sub_date").val(data.subprocess_end);
      
    }
}); 
}

function confirmsubprocess(subid){
  let text = "ยืนยันข้อมูลใช่หรือไม่";
  let process_id = $('#process_id').val();
  let job_id = $('#job_id').val();
  if (confirm(text) == true) {
    text = "ยืนยันข้อมูลแล้ว";
    alert(text);
  $.ajax(
    {
      url: "/confirmsubprocess",
      type: "post",
      dataType: "่json",
      data: {job: job_id, subprocessid: subid,processid: process_id },
      success: function (data) {
        window.location.reload();
      } 
    }
  )
}
}
function deletesubprocess(subid){
  let text = "ลบขั้นตอนการทำงานใช่หรือไม่";
  if (confirm(text) == true) {
    text = "ทำการลบข้อมูลแล้ว";
    alert(text);
        $.ajax(
          {
            url: "/deletesubprocess",
            type: "post",
            dataType: "text",
            data: { subprocessid: subid},
            success: function (data) {
              window.location.reload();
            }
      }); 
  // let text = ('ท่านต้องการลบขั้นตอนการทำงานย่อยใช่หรือไม่');
  // Swal.fire({
  //   title: text,
  //   showDenyButton: false,
  //   showCancelButton: true,
  //   confirmButtonText: "ยืนยัน",
  //   cancelButtonText: "ยกเลิก",
  //   // denyButtonText: `Don't save`
  // }).then((result) => {
  //   /* Read more about isConfirmed, isDenied below */
  //   if (result.isConfirmed) {
  //     // alert(subprocessid);
  //     Swal.fire("ได้ทำการลบข้อมูลแล้ว!", "", "success");
  //     // return false;
  //     let subprocess_id = subprocessid;
  //     $.ajax(
  //       {
  //       url: "deletesubprocess/"+subprocessid,
  //       type: "post",
  //       dataType: "text",
  //       // data: { subprocessid: subprocess_id},
  //       success: function (data) {
  //         // window.location.reload(false);
  //       }
  //   }); 
  //   } 
  //   // else if (result.isDenied) {
  //   //   Swal.fire("Changes are not saved", "", "info");
  //   // }
  // });
  }
}
$(document).on( "change",".selectjob", function() {
    $( "select option:selected" ).each( function() {
      jobid = $(this).val() + " ";
    } );
    $('#urladdprocess').hide();
    jobselect(jobid)    
  
  } );
  // ปุ่มเพิ่ม process
$(document).on("click",".addprocess",function(){
    let job_idprocess = $('.addprocessid').val();
    // alert(job_idprocess);
    addprocess(job_idprocess);
});
// เพิ่ม process
function addprocess(job_idprocess){
  $.ajax(
    {
    url: "/formprocess/job",
    type: "post",
    dataType: 'text',
    data: { job_id: job_idprocess},
    success: function (data) {
  
    }
});   
}

$(document).on("click",".modalclose,.cancel",function(){
  $('#exampleModalToggle').modal('hide');
  $('#sub_id,#subprocessinput,#s_sub_date,#e_sub_date').val("");
  // โหลดหน้าเว็บใหม่
  // window.location.reload();
});
// แก้ไข subprocess
$(document).on("click",".updatesubprocess",function(){
  let subid = $('#sub_id').val();
  let subinput = $('#subprocessinput').val();
  let s_sub_date = $('#s_sub_date').val();
  let e_sub_date = $('#e_sub_date').val();
  var arr1 = s_sub_date.split('/');
  let substart = arr1[2]+'-'+arr1[1]+'-'+arr1[0];
  var arr2 = e_sub_date.split('/');
  let subend = arr2[2]+'-'+arr2[1]+'-'+arr2[0]; 
  var start = document.getElementById("s_date");
  var end = document.getElementById("e_date");
  if( subinput.value == "") {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      subinput.focus();
      return false;
  }else if (s_sub_date.value == "" || e_sub_date.value == ""){
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return false;
  }else if (e_sub_date < s_sub_date){
    alert("กรุณากรอกข้อมูลวันที่ให้ถูกต้อง")
    return false;
  }
  // else if(s_sub_date < start){
  //   alert("กรุณากรอกข้อมูลวันที่ให้ถูกต้อง2")
  //   return false;
  // }else if(e_sub_date > end){
  //   alert("กรุณากรอกข้อมูลวันที่ให้ถูกต้อง3")
  //   return false;
  // }
    $.ajax(
      {
      url: "/updatesubprocess",
      type: "post",
      dataType: 'json',
      data: { sub_id: subid,subprocess_name: subinput,subprocess_start: substart,subprocess_end: subend},
      success: function (data) {
        location.reload();
      }
  });   
});
 
