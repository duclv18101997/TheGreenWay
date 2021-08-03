const emailRegex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;
const userNameRegex = /^([a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+)$/i;

describe('UserName', function () {
  it('String "Duc Le" should match the regex', function () {
    expect('Duc Le').toMatch(userNameRegex);
  });
});

describe('UserName', function () {
  it('String "Lê Văn Đức" should match the regex', function () {
    expect('Lê Văn Đức').toMatch(userNameRegex);
  });
});


describe('UserName', function () {
  it('String "Duc@123123" not match the regex', function () {
    expect('Duc@123123').not.toMatch(userNameRegex);
  });
});

describe('Email', function () {
  it('String "Duclvse04666@fpt.edu.vn" match the regex', function () {
    expect('duc18101997@gmail.com').toMatch(emailRegex);
  });
});

describe('Email', function () {
  it('String "duc123gmail.com" not match the regex', function () {
    expect('duc123gmail.com').not.toMatch(emailRegex);
  });
});

describe('Email', function () {
  it('String "duc123%*#@$d@gmail.com" not match the regex', function () {
    expect('duc123%*#@$d@gmail.com').not.toMatch(emailRegex);
  });
});

describe('Email', function () {
  it('String "1234567@gmail.com" not match the regex', function () {
    expect('1234567@gmail.com').not.toMatch(emailRegex);
  });
});

describe('Password', function () {
  it('String "Duc@123123" match the regex', function () {
    expect('Duc@123123').toMatch(passwordRegex);
  });
});

describe('Password', function () {
  it('String "Duc123123" not match the regex', function () {
    expect('Duc123123').not.toMatch(passwordRegex);
  });
});

describe('Password', function () {
  it('String "Duc" not match the regex', function () {
    expect('Duc').not.toMatch(passwordRegex);
  });
});

describe('Password', function () {
  it('String "LeVanDucFPTUniversityK11Software" not match the regex', function () {
    expect('LeVanDucFPTUniversityK11Software').not.toMatch(passwordRegex);
  });
});