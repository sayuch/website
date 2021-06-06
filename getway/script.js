function convert() {
    var codeLen = Code.value.length;
    var codeLenRemainder;
    var codeTry;

    if (codeLen >= 18){
        codeLenRemainder = codeLen % 18;
        codeLen = Math.floor(codeLen / 18);
        codeTry = codeLen;
        if ((codeLenRemainder == 16) || (codeLenRemainder == 17)){
            codeTry ++;
        }
    }
    else if ((codeLen == 16) || (codeLen == 17)){
        codeTry = 1;
    }
    else if (codeLen < 16){
        codeTry = 0;
    }
    codeTypes(codeTry)
}

function codeTypes(codeTry) {
    var codeLine = 0;
    var branch = 1;

    Source.value = "void " + CodeName.value + "(MenuEntry *entry)\r\n{\r\n    u32 offset;\r\n    u32 data;";

    for (var i = 0; i < codeTry; i++) {
        var codeType1 = Code.value.substr(codeLine,1);
        var codeType2 = Code.value.substr(codeLine,2);
        var addr = Code.value.substr(codeLine + 1,7);
        var vu8 = Code.value.substr(codeLine + 15,2);
        var vu16 = Code.value.substr(codeLine + 13,4);
        var vu32 = Code.value.substr(codeLine + 9,8);
       
        if(codeType1 == "0"){
            addBlank(branch)
            Source.value += "Process::Write32(offset + 0x"+ addr +", 0x"+ vu32 +");";
        }
        else if(codeType1 == "1"){
            addBlank(branch)
            Source.value += "Process::Write16(offset + 0x"+ addr +", 0x"+ vu16 +");";
        }
        else if(codeType1 == "2"){
            addBlank(branch)
            Source.value += "Process::Write8(offset + 0x"+ addr +", 0x"+ vu8 +");";
        }
        else if(codeType1 == "3"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read32(offset + 0x" + addr + ") < 0x" + vu32 + "){";
        }
        else if(codeType1 == "4"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read32(offset + 0x" + addr + ") > 0x" + vu32 + "){";
        }
        else if(codeType1 == "5"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read32(offset + 0x" + addr + ") == 0x" + vu32 + "){";
        }
        else if(codeType1 == "6"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read32(offset + 0x" + addr + ") != 0x" + vu32 + "){";
        }
        else if(codeType1 == "7"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read16(offset + 0x" + addr + ") < 0x" + vu16 + "){";
        }
        else if(codeType1 == "8"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read16(offset + 0x" + addr + ") > 0x" + vu16 + "){";
        }
        else if(codeType1 == "9"){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read16(offset + 0x" + addr + ") == 0x" + vu16 + "){";
        }
        else if((codeType1 == "A") || (codeType1 == "a")){
            addBlank(branch)
            branch ++;
            Source.value += "if (Process::Read16(offset + 0x" + addr + ") != 0x" + vu16 + "){";
        }
        else if((codeType1 == "B") || (codeType1 == "b")){
            addBlank(branch)
            Source.value += "offset = Process::Read32(offset + 0x"+ addr +");";
        }
        else if((codeType1 == "E") || (codeType1 == "e")){//WIP、32bit単位での書き込みのみ対応
            var addr_ = parseInt(addr, 16);
            var byteLen64 = Math.floor(parseInt(vu8, 16) / 8);
            var byteLen32 = Math.floor(parseInt(vu8, 16) % 8 / 4);
            var byteLen8 = Math.floor(parseInt(vu8, 16) % 8 % 4);
            codeLine += 18;
          
            while ((byteLen64 != 0) && (codeTry >= i + byteLen64)){
                byteLen64--;
                i++;
                var value1 = Code.value.substr(codeLine + 0,8);
                var value2 = Code.value.substr(codeLine + 9,8);
             
                addBlank(branch)
                Source.value += "Process::Write32(offset + 0x"+ addr_.toString(16) +", 0x"+ value1 +");";
                addr_ += 4;
                addBlank(branch)
                Source.value += "Process::Write32(offset + 0x"+ addr_.toString(16) +", 0x"+ value2 +");";
                addr_ += 4;
             
                codeLine += 18;
            }

            if ((byteLen32 != 0) && (codeTry >= i + 1)){
                var value1 = Code.value.substr(codeLine + 0,8);
                addBlank(branch)
                Source.value += "Process::Write32(offset + 0x"+ addr_.toString(16) +", 0x"+ value1 +");";
                byteLen32--;
                i++;
                codeLine += 18;
            }

            codeLine -= 18;
        }
        else if((codeType2 == "C0") || (codeType2 == "c0")){
            addBlank(branch)
            branch ++;
            Source.value += "for (int i = 0x0; i < 0x" + vu32 + "; i++){";
        }
        else if((codeType2 == "D0") || (codeType2 == "d0") || (codeType2 == "D1") || (codeType2 == "d1")){
            branch --;
            addBlank(branch)
            Source.value += "}";
        }
        else if((codeType2 == "D2") || (codeType2 == "d2")){
            while (branch != 1){
                branch --;
                addBlank(branch)
                Source.value += "}";
            }
            Source.value += "\r\n    offset = 0;\r\n    data = 0;";
        }
        else if((codeType2 == "D3") || (codeType2 == "d3")){
            addBlank(branch)
            Source.value += "offset = 0x" + vu32 + ";";
        }
        else if((codeType2 == "D4") || (codeType2 == "d4")){
            addBlank(branch)
            Source.value += "data += 0x" + vu32 + ";";
        }
        else if((codeType2 == "D5") || (codeType2 == "d5")){
            addBlank(branch)
            Source.value += "data = 0x" + vu32 + ";";
        }
        else if((codeType2 == "D6") || (codeType2 == "d6")){
            addBlank(branch)
            Source.value += "Process::Write32(offset + 0x" + vu32 + ", data);";
            addBlank(branch)
            Source.value += "offset += 0x4;";
        }
        else if((codeType2 == "D7") || (codeType2 == "d7")){
            addBlank(branch)
            Source.value += "Process::Write16(offset + 0x" + vu32 + ", data);";
            addBlank(branch)
            Source.value += "offset += 0x2;";
        }
        else if((codeType2 == "D8") || (codeType2 == "d8")){
            addBlank(branch)
            Source.value += "Process::Write8(offset + 0x" + vu32 + ", data);";
            addBlank(branch)
            Source.value += "offset += 0x1;";
        }
        else if((codeType2 == "D9") || (codeType2 == "d9")){
            addBlank(branch)
            Source.value += "data = Process::Read32(offset + 0x" + vu32 + ");";
        }
        else if((codeType2 == "DA") || (codeType2 == "da")){
            addBlank(branch)
            Source.value += "data = Process::Read16(offset + 0x" + vu32 + ");";
        }
        else if((codeType2 == "DB") || (codeType2 == "db")){
            addBlank(branch)
            Source.value += "data = Process::Read8(offset + 0x" + vu32 + ");";
        }
        else if((codeType2 == "DC") || (codeType2 == "dc")){
            addBlank(branch)
            Source.value += "offset += 0x" + vu32 + ";";
        }
        else if((codeType2 == "DD") || (codeType2 == "dd")){
            addBlank(branch)
            branch++;
            Source.value += "if (is_pressed(0x" + vu32 + ")){";
        }
       
        codeLine += 18;
    }
    Source.value += "\r\n}";
}

function addBlank(branch){
    var j = 0;
    addNewLine()
   
    while (j != branch){
        j++;
        Source.value += "    ";
    }
}

function addNewLine(){
    Source.value += "\r\n";
}

var clipboadCopy = function(){
    var sourcetext = document.getElementById("Source");
    sourcetext.select();
    document.execCommand("copy");
}

function resettextarea(){
    CodeName.value = "";
    Code.value = "";
    Source.value = "";
}