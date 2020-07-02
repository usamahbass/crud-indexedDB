const idbPromise = idb.open("perpustakaan", 1, (upgradeDB) => {
  if (!upgradeDB.objectStoreNames.contains("buku")) {
    //   membuat index objek store
    const peopleDifferent = upgradeDB.createObjectStore("buku", {
      // membuat primary key dengan keypath
      keyPath: "isbn",
      // memvbuat primary key dengan keygenerator
      //   autoIncrement: true,
    });

    // membuat index pencarian
    // => peopleDifferent.createIndex("indexName", "property", options)

    peopleDifferent.createIndex("judul", "judul", {
      // unik key
      unique: false,
    });

    peopleDifferent.createIndex("nomorInduk", "nomorInduk", {
      // unik key
      unique: true,
    });
  }
});

// create data

idbPromise
  .then((db) => {
    console.log(db);

    let tx = db.transaction("buku", "readwrite");
    console.log(tex);

    let store = tx.objectStore("buku");
    console.log(store);

    let item = {
      isbn: 123456789,
      judul: "Menjadi FrontEnd Developer Expert",
      description: "learn, learn, and learn jonn !",
      created: new Date().getTime(),
    };

    let request = store.add(item);

    console.log(request);

    // store.add(item, item.isbn);
    return tx.complete;
  })
  .then(() => console.log("Buku berhasil disimpan !"))
  .catch((err) => console.log("Buku gagal disimpan !", err));

// read data dengan get

idbPromise
  .then((db) => {
    const tx = db.transaction("buku", "readonly");
    const store = tx.objectStore("buku");

    // mengambil primary key berdasarkan isbn
    // akan mereturn object

    return store.get(123456789);
  })
  .then((val) => {
    console.table(val);
  });

// read banyak data dengan getAll

idbPromise
  .then((db) => {
    const tx = db.transaction("buku", "readonly");
    const store = tx.objectStore("buku");

    // akan mereturn array
    return store.getAll();
  })

  .then((res) => {
    console.log("Data yang diambil");
    console.table(res);
  });

// read banyak data dengan Cursor
// => objectStore.openCursor(keyRange, direction)

idbPromise
  .then((db) => {
    const tx = db.transaction("buku", "readonly");
    const store = tx.objectStore("buku");

    return store.openCursor();
  })
  .then(function ambilBuku(cursor) {
    if (!cursor) {
      return;
    }
    console.log(`Posisi cursor: ${cursor.key}`);

    for (let field in cursor.value) {
      console.log(cursor.value[field]);
    }

    return cursor.continue().then(ambilBuku);
  })
  .then(() => console.log("Tidak ada data lain !"));

// menentukan batasan data yang ingin diambil

IDBKeyRange.lowerBound(10);
// => ambil data dengan key 10 beserta seluruh data sesudahnya

IDBKeyRange.upperBound(10);
// => sama dengan lowerBound() tetapi upperBound beserta data sebelumnya

IDBKeyRange.bound(10, 100);
// => ambil data dari key 10 sampai key 100

IDBKeyRange.only(7);
// => ambil data dengan nilai key tertentu

// update data

idbPromise
  .then((db) => {
    let tx = db.transaction("buku", "readwrite");
    let store = tx.objectStore("buku");

    let item = {
      isbn: 123456789,
      judul: "Menjadi FrontEnd Developer Expert",
      description: "learn, learn, and learn boyy !",
      created: new Date().getTime(),
    };

    store.put(item);
    return tx.complete;
  })
  .then(() => console.log("Data berhasil diubah !"));

// delete data

idbPromise
  .then((db) => {
    let tx = db.transaction("buku", "readwrite");
    let store = tx.objectStore("buku");

    const request = store.delete(123456789);

    console.log(request);

    return tx.complete;
  })
  .then(() => console.log("Buku telah dihapus dari database !"));
