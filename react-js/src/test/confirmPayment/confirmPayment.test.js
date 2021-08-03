const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
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

describe('Phone Number', function () {
  it('String "0349117888" match the regex', function () {
    expect('0349117888').toMatch(phoneRegex);
  });
});

describe('Phone Number', function () {
  it('String "0915092889" match the regex', function () {
    expect('0915092889').toMatch(phoneRegex);
  });
});

describe('Phone Number', function () {
  it('String "+84349117888" match the regex', function () {
    expect('+84349117888').toMatch(phoneRegex);
  });
});

describe('Phone Number', function () {
  it('String "01649921788" not match the regex', function () {
    expect('01649921788').not.toMatch(phoneRegex);
  });
});

describe('Phone Number', function () {
  it('String "1234567890" not match the regex', function () {
    expect('1234567890').not.toMatch(phoneRegex);
  });
});

describe('Phone Number', function () {
  it('String "111111111" not match the regex', function () {
    expect('1234567890').not.toMatch(phoneRegex);
  });
});