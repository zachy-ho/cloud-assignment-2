function (doc) {
  if (doc.State.toLowerCase() === 'vic') {
      emit([doc.Month, doc.Year], doc.Count);
  }
}
