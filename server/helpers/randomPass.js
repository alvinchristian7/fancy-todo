module.exports = ()=>{
  let alfaKecil = 'abcdefghijklmnopqrstuvwxyz'
  let alfaBesar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let angka = '0123456789'
  let acak = [alfaKecil,alfaBesar,angka]
  let pass = ''
  for(let i = 0; i < 8; i++){
    let dapet = Math.floor(Math.random()*acak.length)
    let apa = Math.floor(Math.random()*acak[dapet].length)
    pass += acak[dapet][apa]
  }
  return pass
}