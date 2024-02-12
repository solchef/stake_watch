const sheets = google.sheets({ version: 'v4', auth: client });

sheets.spreadsheets.values.get({
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  range: 'Sheet1!A1:B10' // Specify the range you want to read
}, (err, res) => {
  if (err) {
    console.error('The API returned an error:', err);
    return;
  }
  const rows = res.data.values;
  if (rows.length) {
    console.log('Data:');
    rows.forEach(row => {
      console.log(`${row[0]}, ${row[1]}`);
    });
  } else {
    console.log('No data found.');
  }
});





https://docs.google.com/spreadsheets/d/1LbCRU3p-coWV6FlLPykuZy3naxxS7pLlXNVotrjbDw0/edit?usp=sharing