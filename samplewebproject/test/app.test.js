const assert = require('assert');

it('has a text input', async () => {
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');
    //if input is equal to null, will throw error
    assert(input); 
});

it('shows a success message with a valid e-mail', async () => {
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');
    input.value = 'asdf@gmail.com';
    //trigger form selection event
    dom.window.document
        .querySelector('form')
        .dispatchEvent(new dom.window.Event('submit'));

    const h1 = dom.window.document.querySelector('h1')
    
    assert.strictEqual(h1.innerHTML, 'looks good!')

});

it('shows a success message with a valid e-mail', async () => {
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');
    input.value = 'asdfgmail.com';
    //trigger form selection event
    dom.window.document
        .querySelector('form')
        .dispatchEvent(new dom.window.Event('submit'));

    const h1 = dom.window.document.querySelector('h1')

    assert.strictEqual(h1.innerHTML, 'invalid e-mail')

});