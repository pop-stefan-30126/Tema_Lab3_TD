var app = new Vue({
    el: '#hamming-encoder',
    data: {
        dataBits: [],
        status: '',
        numberOfDataBits: 0,
    },
    created: function () {
        this.initDataBits(0);
        
    },
    methods: {
        initDataBits: function(){
            this.dataBits=[];
           
            for(var i=0;i<this.numberOfDataBits;i++){
                var bit = { data: null };
                this.dataBits.push(bit);
            }
           
        },
        send: function () {
            if (this.validate(this.dataBits) === true) {
              var encodedMessage = this.encode(this.dataBits);
              // this.status = encodedMessage + ' encoded sent to server ';
              console.log(encodedMessage, this.dataBits);
              return axios
                .put("http://localhost:3000/message", { bits: encodedMessage })
                .then((response) => (this.status = response.data));
            }
          },
        encode: function(bits){
            var bitsLenght = this.numberOfDataBits;
            var vec = [], mesaj = [];
            var i=1, j=0, k = 0, nrControl=0;
            while(j<bitsLenght) {

                if(this.powerOfTwo(i)===true) 
                    vec.push(-1);
                else
                    {vec.push(bits[j].data);
                        j++;}
                i++;        
            
            }

            while(k<bitsLenght) {
                mesaj.push(parseInt(bits[k].data));
                k++;        
            }
            
            for (var i=0; i<vec.length;i++)  {
                if(vec[i] == 1) {
                    vec[i] = 1;
                }

                if(vec[i] == -1) {
                    nrControl ++;
                    vec[i] = 0;
                }
            }

             
            var widthMatrix = vec.length;
            var lengthMatrix = nrControl;

            var matrix =[];
            var arr = [];

            for(var i=0;i<vec.length;i++) {
                arr[i] = parseInt(vec[i]);
            }
            
            var arr1 = [];
            for(var i=0;i<arr.length;i++)
                arr1[i] = [];

            for(var i=0;i<arr.length;i++)
                for(var j=0;j<1;j++)
                   arr1[i][j] = arr[i];
            
            
            for(var i=0; i<widthMatrix; i++) {
                matrix[i] = [];
                var num = this.dec2Bin(i+1);
                var num1 = this.pad(num,lengthMatrix);
            
                num1 = this.reverseNumber(num1);
                for (var j=0; j<lengthMatrix; j++)
                {
                    matrix[i][j] = num1 % 10;
                    num1 = num1/10|0;
                }
            }

            var matrix1 = this.transposeArrayMatrix(matrix,lengthMatrix,widthMatrix);

            var sum = 0;
            var c =[];

            for(var i=0;i<lengthMatrix;i++) {
                for(var j=0;j<widthMatrix;j++) {
                        sum = sum + matrix1[i][j] * arr1[j];
                }
                c[i] = this.parity(sum);
                sum = 0;
            }

           var matrix2 = [];
           var k = c.length-1, l = 0;

           
           for (var i=0; i<arr.length;i++) {
                if(this.powerOfTwo(i+1)===true){
                    matrix2.push(c[k]);
                    k --;
                }
                else {
                    matrix2.push(mesaj[l]);
                    l++;
                }
           }
           console.log("Mesajul transmis");
           console.log(matrix2);  
          
           for(var i=0; i<matrix2.length;i++) {
               bits[i] = matrix2[i];
           }
            return [bits,matrix1,widthMatrix,lengthMatrix]; //Cuvantul de transmis
        },
        parity: function(number){
            return number % 2;
        },
        reverseNumber: function(number) {
            number = number + "";
            return number.split("").reverse("").join("");
        },
        transposeArrayMatrix: function(array, width, length) {
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
        },
        pad: function(num,size) {
            while(num.length < size) num = "0" + num;
            return num;
        },
        powerOfTwo: function(number){
            return (Math.log(number)/Math.log(2)) % 1 === 0;
        },
        dec2Bin:function(number) {
            return number.toString(2);
        },
        validate: function(bits){
            for(var i=0; i<bits.length;i++){
                if (this.validateBit(bits[i].data) === false)
                return false;
            }
            return true;
        },
        validateBit: function(character){
            if (character === null) return false;
            return (parseInt(character) === 0 ||
            parseInt(character) === 1);  
        }
    }
})