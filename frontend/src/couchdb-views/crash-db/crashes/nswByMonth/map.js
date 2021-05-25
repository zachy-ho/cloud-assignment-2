function (doc) {
  if (doc.State.toLowerCase() === 'nsw') {
      emit([doc.Month, doc.Year], doc.Count);
  }
}
