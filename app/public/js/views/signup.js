$(document).ready(function(){
	
	var sc = new SignupController();
	
	$('#account-form-btn2').click(function(evt) {
        if($('#account-form').valid()){
            $('.modal-alert').modal('show');
        }
    }); 
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been created.</br>Click OK to return to the login page.');

})