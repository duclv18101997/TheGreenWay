const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;

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