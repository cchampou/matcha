function checkTag(e) {
	if (e.keyCode == 13) {
		if (e.target.value.length > 1) {
			var list = $("#tagvalue").val();
			var data = JSON.parse(list);
			console.log(data);
			data.push(e.target.value);
			$("#tagvalue").val(JSON.stringify(data));
			$("#taglist").append('<li onclick="return removeTag(event);">'+e.target.value+'</li>');
			e.target.value = '';
		}
		return false;
	}
	return true;
}

function removeTag(e) {
	var list = $("#tagvalue").val();
	var data = JSON.parse(list);
	console.log(data);
	console.log(e.target.innerHTML);
	console.log(data.indexOf(e.target.innerHTML));
	data.splice(data.indexOf(e.target.innerHTML), 1);
	$("#tagvalue").val(JSON.stringify(data));
	e.target.parentNode.removeChild(e.target);
}

$(document).ready(function() {
	if ($("#tagvalue").length) {
		var list = $("#tagvalue").val();
		var data = JSON.parse(list);
		data.map(function(e) {
			$("#taglist").append('<li onclick="return removeTag(event);">'+e+'</li>');
		});
	}
});
