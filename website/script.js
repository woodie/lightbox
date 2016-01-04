function show_time() {
  var time_span = document.getElementById("time_span");
  var time_date = new Date;
  return time_span.innerHTML = time_date.toString();
}
