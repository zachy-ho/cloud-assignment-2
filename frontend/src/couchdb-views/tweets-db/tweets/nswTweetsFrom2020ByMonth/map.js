function (doc) {
  let dateSegs = doc.Date.split(' ');
  const month = dateSegs[1];
  const year = dateSegs[dateSegs.length - 1];
  
  const monthMap = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
  };
  
  const stateNames = ['nsw', 'new south wales'];
  const tweetPlaceSegs = doc.Place.split(',').map(i => i.trim().toLowerCase());
  let locationIndex = 0;
  if (tweetPlaceSegs.some((item) => {
    locationIndex = stateNames.indexOf(item);
    return locationIndex >= 0;
  })) {
    if (parseInt(year) >= 2020) {
      emit([parseInt(year), monthMap[month]], 1);
    }
  }
}
