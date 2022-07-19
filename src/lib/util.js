const sanitizeHtml = require("sanitize-html")

const sanitizeOptions = {
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'blockquote'

    ],
    allowedAttributes: {
        a:['href', 'name', 'target'],
        img:['src'],
        li:['class'],
    },
    allowedSchemes: ['data', ]

}


exports.removeHTML = body => {
    const filtered =  sanitizeHtml(body, sanitizeOptions);

    return filtered;

}