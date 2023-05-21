const testData = () => {
  let resourceObj = new Object();
  let jumlah = 0;
  let totalTransaksi = [];
  let arrayPerbulan = [];

  const nilaiAtas = 1.25;
  const nilaiBawah = 0.75;

  getResourceData.forEach((row, index, array) => {
    if (index === 0) return;
    if (row[12] < 0) {
      jumlah += 1;
      totalTransaksi.push(row);
      // Per Tanggal
      let perBulanObj = new Object();
      let dataBulan = row[15];
      let dataTahun = row[16];
      let totalData = array.reduce((val, obj) => {
        if (obj[15] === row[15] && obj[16] === row[16]) {
          return val + 1;
        } else {
          return val;
        }
      }, 0);
      let totalqty = array.reduce((val, obj) => {
        if (obj[15] === row[15] && obj[16] === row[16]) {
          return val + obj[12];
        } else {
          return val;
        }
      }, 0);

      const countDate = array.reduce((val, obj) => {
        if (obj[15] === row[15] && obj[16] === row[16]) {
          if (val[obj[1]]) {
            val[obj[1]]++;
          } else {
            val[obj[1]] = 1;
          }
        }
        return val;
      }, {});

      perBulanObj.bulan = dataBulan;
      perBulanObj.tahun = dataTahun;
      perBulanObj.dataTransaksi = totalData;
      perBulanObj.nilaiTransaksi = -totalqty;
      perBulanObj.totalTanggal = Object.keys(countDate).length;
      perBulanObj.rataPerBulan = totalData / Object.keys(countDate).length;
      perBulanObj.batasAtas =
        (totalData / Object.keys(countDate).length) * nilaiAtas;
      perBulanObj.batasBawah =
        (totalData / Object.keys(countDate).length) * nilaiBawah;

      const result = arrayPerbulan.find(
        (obj) => obj.bulan === row[15] && obj.tahun === row[16]
      );
      if (!result) {
        arrayPerbulan.push(perBulanObj);
      }
    }
  });

  //ambil tanggal yang sama  dari seluruh data
  let tanggalTransaksiUnique = totalTransaksi.filter((row, index, self) => {
    const find = self.findIndex((data) => {
      return (
        row[14] === data[14] && row[15] === data[15] && row[16] === data[16]
      );
    });
    return find === index;
  });

  let rataRata = jumlah / tanggalTransaksiUnique.length;

  resourceObj.jumlahTransaksi = jumlah;
  resourceObj.totalTransaksiUniqueTgl = tanggalTransaksiUnique.length;
  resourceObj.nilaiRataRata = rataRata;
  resourceObj.batasAtas = rataRata * nilaiAtas;
  resourceObj.batasBawah = rataRata * nilaiBawah;

  const {
    jumlahTransaksi,
    totalTransaksiUniqueTgl,
    nilaiRataRata,
    batasAtas,
    batasBawah,
  } = resourceObj;

  // menampilkan semua data memenuhi syarat batas atas dan bawah.
  const arrayKriteria4 = arrayPerbulan.filter(
    (data) => batasAtas < data.batasAtas || batasBawah > data.batasBawah
  );

  const getSheetSummary =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary Kriteria 4");

  const getCellTotalTransaksi = getSheetSummary.getRange("B2");
  getCellTotalTransaksi.setValue(jumlahTransaksi);

  const getCellRataSeluruhTransaksi = getSheetSummary.getRange("B3");
  getCellRataSeluruhTransaksi.setValue(nilaiRataRata);

  const getCellJumlahTanggal = getSheetSummary.getRange("B4");
  getCellJumlahTanggal.setValue(totalTransaksiUniqueTgl);

  const getCellNilaiAtas = getSheetSummary.getRange("B5");
  getCellNilaiAtas.setValue(batasAtas);

  const getCellNilaiBawah = getSheetSummary.getRange("B6");
  getCellNilaiBawah.setValue(batasBawah);

  const numRows = arrayKriteria4.length;
  const numColumns = Object.keys(arrayKriteria4[0]).length;
  const startRow = 3;
  const startColumn = 4;

  var getCellSummaryPerbulan = getSheetSummary.getRange(
    startRow,
    startColumn,
    numRows,
    numColumns
  );

  var dataSummaryPerBulan = arrayKriteria4.map(function (obj) {
    return Object.values(obj);
  });

  getCellSummaryPerbulan.setValues(dataSummaryPerBulan);
};
