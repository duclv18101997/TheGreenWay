const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;

describe('Password', function () {
  it('String "Duc@1997" match the regex', function () {
    expect('Duc@1997').toMatch(passwordRegex);
  });
});

describe('Password', function () {
  it('String "Duc123456" not match the regex', function () {
    expect('Duc123456').not.toMatch(passwordRegex);
  });
});

describe('Password', function () {
  it('String "abc" not match the regex', function () {
    expect('abc').not.toMatch(passwordRegex);
  });
});

describe('Password', function () {
  it('String "LeVanDucFPTUniversityK11Software" not match the regex', function () {
    expect('LeVanDucFPTUniversityK11Software').not.toMatch(passwordRegex);
  });
});