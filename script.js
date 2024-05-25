// GỌI BIẾN
let taoKhoa = document.querySelector("#create-key");
let ky = document.querySelector("#sign");
let chuyen = document.querySelector("#chuyen");
let kiemTra = document.querySelector("#check_sign");
let fileInputVBKy = document.querySelector("#file_1_van_ban_ky");
let fileInputVBKyCheck = document.querySelector("#file_2_van_ban_ky_check");
let fileInputCKyCheck = document.querySelector("#file_3_chu_ky_check");
let saveFileTXT = document.querySelector("#saveFileTXT");
let saveFileDOCX = document.querySelector("#saveFileDOCX");
// FUNCTIONS:
// CHUYỂN NHỊ PHÂN
function chuyenNhiPhan(number) {
  let a = [];
  let bit;
  while (number > 0) {
    bit = number % 2;
    a.unshift(bit);
    number = Math.floor(number / 2);
  }
  return a;
}
// CHECK SNT
function isSNT(number) {
  if (number < 2) {
    return true;
  } else {
    for (let i = 2; i < Math.sqrt(number); i++) {
      if (number % i == 0) {
        return false;
      }
    }
    return true;
  }
}

// BÌNH PHƯƠNG VÀ NHÂN
function binhPhuongNhan(alp, k, m) {
  let b = chuyenNhiPhan(k);
  let P = 1;
  for (let i = 0; i < b.length; i++) {
    if (b[i] == 0) {
      P = P * P;
      P = P % m;
    } else {
      P = P * P;
      P = P % m;
      P = P * alp;
      P = P % m;
    }
  }
  return P;
}

// function binhPhuongVaNhan(x, num, y) {
//   const tinh = num.toString(2);
//   let p = 1;
//   for (let i = 0; i < tinh.length; i++) {
//     p = (p * p) % y;
//     if (tinh[i] == 1) {
//       p = p * x;
//       p = p % y;
//     }
//   }
//   return p;
// }
// EUCLIDE
function euclide(k, p) {
  let ri = p;
  let riNext = k;
  let tT = 0,
    tS = 1;
  let tiNext;
  let tmp;
  let gtmp;
  while (riNext > 1) {
    tiNext = tT - tS * Math.floor(ri / riNext);
    tmp = riNext;
    riNext = ri - riNext * Math.floor(ri / riNext);
    ri = tmp;
    gtmp = tS;
    tS = tiNext;
    tT = gtmp;
  }
  if (tiNext < 0) {
    tiNext = tiNext + p;
  }
  return tiNext;
}

// CHECK__GCD
function GCD(a, b) {
  if (b == 0) {
    return a;
  } else {
    return GCD(b, a % b);
  }
}
function isGCD(a, b) {
  if (GCD(a, b) != 1) {
    return false;
  } else {
    return true;
  }
}

// TÍNH DETA - GAMA KHI KÝ
function detaGama(text) {
  let soP = parseInt(document.querySelector("#soP").value);
  let soAlpha = parseInt(document.querySelector("#soAlpha").value);
  let soA = parseInt(document.querySelector("#soA").value);
  let soK = parseInt(document.querySelector("#soK").value);

  let gama = binhPhuongNhan(soAlpha, soK, soP);
  document.querySelector("#gama").value = gama;

  let res = euclide(soK, soP - 1);
  var chuKy = [];
  const bam = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);

  var x = [];
  let run = 0;
  for (let i = 0; i < 4; i++) {
    x.push(bam.slice(run, run + 8));
    run += 8;
  }

  for (let i = 0; i < x.length; i++) {
    let res2 = (parseInt(x[i], 16) - soA * gama) % (soP - 1);
    let result = (res2 * res) % (soP - 1);
    if (result < 0) {
      result = result + (soP - 1);
    }
    chuKy.push(result);
  }
  console.log("Chữ ký: " + chuKy);
  let deta = chuKy.map((item) => item.toString()).join(", ");
  document.querySelector("#deta").value = deta;
  console.log("Deta: " + deta);
  document.querySelector("#text-cky").innerHTML = deta;
  document.querySelector("#deta").value = deta;
  document.querySelector("#bam-1").value = bam;
}

// KIỂM TRA CHỮ KÝ
function kiemTraChuKy(text) {
  let soP = parseInt(document.querySelector("#soP").value);
  let soAlpha = parseInt(document.querySelector("#soAlpha").value);
  let soA = parseInt(document.querySelector("#soA").value);
  let beta = parseInt(document.querySelector("#beta").value);
  let gama = parseInt(document.querySelector("#gama").value);
  let deta = document.querySelector("#text-cky").value;
  let detaCheck = document.querySelector("#text-check-cky").value;

  let detaArr = deta.split(", "); // Mảng chứa các giá trị của Deta - Chữ ký
  let detaCheckArr = detaCheck.split(", ");
  let arr_1 = [];
  let arr_2 = [];

  // BĂM TEXT
  let bam = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex); // 128 / 4 = 32

  document.querySelector("#bam-2").value = bam;

  let hash = []; // Mảng chứa mã sau băm text -Văn bản ký
  let run = 0;

  for (let i = 0; i < 4; i++) {
    hash.push(bam.slice(run, run + 8));
    run += 8;
  }

  console.log(hash[1].toString(2));
  for (let i = 0; i < hash.length; i++) {
    let vT1 = binhPhuongNhan(beta, gama, soP);
    let vT2 = binhPhuongNhan(gama, parseInt(detaArr[i]), soP);
    let tam = (vT1 * vT2) % soP;
    arr_1.push(tam);

    let vP = binhPhuongNhan(soAlpha, parseInt(hash[i], 16), soP);
    arr_2.push(vP);
  }

  let checkVBK = true;
  for (let i = 0; i < arr_1.length; i++) {
    if (arr_1[i] != arr_2[i]) {
      checkVBK = false;
    }
  }

  // THÊM KỊCH BẢN
  if (detaArr.length != detaCheckArr.length) {
    document.querySelector("#message").innerHTML = "-Chữ ký sai";
  } else {
    let checkCK = true;
    for (let i = 0; i < detaCheckArr.length; i++) {
      if (detaArr[i] != detaCheckArr[i]) {
        checkCK = false;
      }
    }
    if (checkCK == true) {
      document.querySelector("#message").innerHTML = "-Chữ ký đúng";
    } else {
      document.querySelector("#message").innerHTML = "-Chữ ký sai";
    }
  }
  // KẾT THÚC THÊM
  if (checkVBK == true) {
    document.querySelector("#message").innerHTML +=
      "\n-Văn bản chưa bị sửa đổi";
  }
  if (checkVBK == false) {
    document.querySelector("#message").innerHTML += "\n-Văn bản đã bị sửa đổi";
  }
  console.log(arr_1);
  console.log(arr_2);
}

// THAO TÁC
// CREATE__KEY
taoKhoa.addEventListener("click", () => {
  let soP = parseInt(Math.floor(Math.random() * 1000000));
  while (isSNT(soP) != true) {
    soP = Math.floor(Math.random() * 1000000);
  }

  let soAlpha = parseInt(Math.floor(Math.random() * soP));
  while (soAlpha == 0) {
    soAlpha = parseInt(Math.floor(Math.random() * soP));
  }

  let soA = parseInt(Math.floor(Math.random() * (soP - 2)));
  while (soA < 2) {
    soA = parseInt(Math.floor(Math.random() * (soP - 2)));
  }

  let soK = parseInt(Math.floor(Math.random() * (soP - 2)));
  while (isGCD(soK, soP - 1) == false || soK == 0) {
    soK = parseInt(Math.floor(Math.random() * (soP - 2)));
  }
  console.log(isGCD(soK, soP - 1));

  document.querySelector("#soP").value = soP;
  document.querySelector("#soAlpha").value = soAlpha;
  document.querySelector("#soA").value = soA;
  document.querySelector("#soK").value = soK;

  let beta = binhPhuongNhan(soAlpha, soA, soP);
  document.querySelector("#beta").value = beta;
  // alert("--Tạo khóa thành công--");
});

// KÝ
ky.addEventListener("click", () => {
  let text = document.querySelector("#text-ky").value;
  detaGama(text);
});

// CHUYỂN
chuyen.addEventListener("click", () => {
  document.querySelector("#text-check-ky").value =
    document.querySelector("#text-ky").value;
  document.querySelector("#text-check-cky").value =
    document.querySelector("#text-cky").value;
});
// KIỂM TRA CHỮ KÝ
kiemTra.addEventListener("click", () => {
  let text = document.querySelector("#text-check-ky").value;
  kiemTraChuKy(text);
});

let x = "hello các bạn?";
k = x.split(" ");
console.log(k);

// CHỨC NĂNG VỀ FILE BAO GỒM CẢ: FUNC + THAO TÁC
fileInputVBKy.addEventListener("change", (event) => {
  const { files } = event.target;

  console.log("files", files);
});

// FILE 1: INPUT VĂN BẢN KÝ
fileInputVBKy.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    if (file.name.endsWith(".docx")) {
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function (result) {
            document.getElementById("text-ky").value = result.value.replace(
              /<\/?[^>]+(>|$)/g,
              ""
            );
          })
          .catch(function (err) {
            console.error("Error reading .docx file:", err);
          });
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".txt")) {
      reader.onload = function (e) {
        const text = e.target.result;
        document.getElementById("text-ky").value = text;
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file type. Please upload a .docx or .txt file.");
    }
  } else {
    console.log("No file selected");
  }
});

// FILE 2: INPUT VĂN BẢN KÝ CHECK
fileInputVBKyCheck.addEventListener("change", () => {
  document.getElementById("text-check-ky").innerHTML = "Đang chuyển dữ liệu";
});
fileInputVBKyCheck.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    if (file.name.endsWith(".docx")) {
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function (result) {
            document.querySelector("#text-check-ky").value =
              result.value.replace(/<\/?[^>]+(>|$)/g, "");
          })
          .catch(function (err) {
            console.error("Error reading .docx file:", err);
          });
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".txt")) {
      reader.onload = function (e) {
        const text = e.target.result;
        document.getElementById("text-check-ky").value = text;
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file type. Please upload a .docx or .txt file.");
    }
  } else {
    console.log("No file selected");
  }
});

// FILE 3: INPUT CHỮ KÝ CHECK
fileInputCKyCheck.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    if (file.name.endsWith(".docx")) {
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function (result) {
            document.getElementById("text-check-cky").value =
              result.value.replace(/<\/?[^>]+(>|$)/g, "");
          })
          .catch(function (err) {
            console.error("Error reading .docx file:", err);
          });
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".txt")) {
      reader.onload = function (e) {
        const text = e.target.result;
        document.getElementById("text-check-cky").value = text;
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file type. Please upload a .docx or .txt file.");
    }
  } else {
    console.log("No file selected");
  }
});

// DOWNLOAD FILE
// TXT
saveFileTXT.addEventListener("click", () => {
  const content = "Chữ ký: " + document.querySelector("#deta").value;
  const fileName = "chuKy.txt";
  const file = new File([content], fileName, {
    type: content.type,
  });

  saveAs(file);
});

// DOCX
saveFileDOCX.addEventListener("click", () => {
  const content = "Chữ ký: " + document.querySelector("#deta").value;
  const fileName = " .docx";
  const file = new File([content], fileName, {
    type: content.type,
  });

  saveAs(file);
});
