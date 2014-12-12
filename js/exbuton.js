var rows = [];
var dialog = function(id){
	$('#dialog-form').dialog({
			modal : true ,
			buttons : {
			"Save" : function(){			
				if ($('#dialog-form').valid()) {
					var row = {
					 id : (id != null) ? rows[id].id : null,
		    		 title : $("#title").val(),
					 brand : $("#brand").val(),
					 amount : parseFloat($("#salesAmount").val()),
					 chf : parseInt(parseFloat($("#salesAmount").val()) * 1.1),
					 launchtime : $("#launchTime").val(),
					 selectYear : $("#selectYear").val(),
					 confidential : $("#confidential").val(),
	 		    		};

	           addRow(row,id);
	           $(this).dialog( "close" );
				}
						
			},	
        	Cancel: function() {
          $(this).dialog( "close" );
        }
      },
	});
};



$(document).ready(function(){

  render();
 loadTotal();


$("#btn1").on('click',function(){
						$("#title").val('');
						$("#brand").val('');
						$("#salesAmount").val('');
						$("#launchTime").val('Q1');
						$("#selectYear").val('2011');
						$("#confidential").val('Low');
		dialog();
	    render();
        
});


});



function addRow(row,index) {
if (index == null) {
rows.push(row); 
id = rows.length - 1; // last element
	if (rows.length == 1) {
		rows[id].id = 1;		         
		 }else{
		var newid = rows[id - 1].id + 1  // increment id of previous element
		rows[id].id = newid // add new id to last element
							 } ;
}else{
	rows[index] = row;
}								

		

		localStorage.setItem('rows', JSON.stringify(rows));
		render();
		loadTotal();
}


function render () {

 if ( localStorage.getItem('rows') != null) {
				rows = JSON.parse(localStorage.getItem('rows'));
			}else{
				localStorage.setItem('rows', JSON.stringify(rows)); // creaza obiectul da el nu exista
			}
			
   var data = {
		   	    "rows" : rows ,
		   	    "index" : function(){
	   	  		return rows.indexOf(this);
   	  		},	 
     };



 	
var template = $('#row_template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, data );
  $('tbody').html(rendered);
}


function deleteRow(id) {
    $("#dialog-confirm").dialog({
        width: 500,
        modal: true,
        buttons: {
            "OK": function() {
                rows.splice(id, 1);
                localStorage.setItem('rows', JSON.stringify(rows));
                $(this).dialog("close");
                render();
                loadTotal();
            },
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });
}


function updateRow(id) {
	dialog(id);


	var row = rows[id];
	
		$("#title").val(row.title);
		$("#brand").val(row.brand);
		$("#salesAmount").val(row.amount);
		$("#launchTime").val(row.launchtime);
		$("#selectYear").val(row.selectYear);
		$("#confidential").val(row.confidential);
 
}

function loadTotal(){
	var totalUSD = 0;
	var totalCHF = 0;
	var num = rows.length;
  
for (var i = 0; i < rows.length ; i++) {
	totalUSD +=   rows[i].amount;
	totalCHF +=   parseInt(rows[i].amount*1.1);
 }

	var template = $('#totals_template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, { "totalUSD" : totalUSD, "totalCHF" : totalCHF, "num" : num }   );
  $('#totals').html(rendered);
}
