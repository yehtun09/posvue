let MaxlengthCheck = (object)=>
{
    var object = String(object);
    if (object.length > 2)
    object= object.slice(0, 2);
    return Number(object);
}

export default MaxlengthCheck;