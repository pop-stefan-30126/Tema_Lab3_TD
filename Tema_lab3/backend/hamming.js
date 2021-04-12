
function decode(bits) {
	var length= bits[3];
	var matrix1 = bits[1];
	var width= bits[2];
	var bits = bits[0];
	var errorPosition = 0;	

	var sum = 0;
            var c =[];

            for(var i=0;i<length;i++) {
                for(var j=0;j<width;j++) {
                        sum = sum + matrix1[i][j] * bits[j];
                }
                c[i] = sum%2;
                sum = 0;
            } 
   
	var errorDetected=false;
	if (errorPosition!=0) errorDetected=true;
	if (errorDetected) {
		bits[errorPosition-1]=(bits[errorPosition-1]+1)%2;
	}
    return { errorCorrected: errorDetected, errorPosition: errorPosition, bits: bits};
}


reverseNumber =  function(number) {
	number = number + "";
	return number.split("").reverse("").join("");
}
transposeArrayMatrix = function(array, width, length) {
	var newArray = [];
	for(var i=0; i<width; i++) {
		newArray[i] = [];
	}
	for(var i=0; i<length; i++){
		for(var j=0; j<width; j++) {
			newArray[j].push(array[i][j]);
		}
	}
	return newArray;
}

pad = function(num,size) {
	while(num.length < size) num = "0" + num;
	return num;
}

powerOfTwo = function(number){
	return (Math.log(number)/Math.log(2)) % 1 === 0;
}

dec2Bin = function(number) {
	return number.toString(2);
}

exports.decode = decode;
