

export const CustomDate = () => {
  var today, dd, mm, yyyy;
  today = new Date();
  dd = today.getDate()+1;
  mm = today.getMonth() + 1;
  yyyy = today.getFullYear();
  return yyyy+"-"+mm+"-"+dd;
}
