
import FileSaver from 'file-saver';
import XLSX from 'xlsx';

export function exportExcel(id,name) {
    let wb = XLSX.utils.table_to_book(document.querySelector('#'+id));
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
    try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name+'.xlsx');
    } catch (e) {
        if (typeof console !== 'undefined')
            console.log(e, wbout)
    }
    return wbout
}