exports.validateInput = (schema, ctx)=> {
    const result = schema.validate(ctx.request.body);
        console.log(`validations ${schema}, ${ctx}`);
        if(result.error) {
            ctx.status= 400;
            ctx.body = result.error;
            return;
        }
};

