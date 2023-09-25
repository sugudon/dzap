import React, {useEffect, useRef, useState} from 'react';

import useAutosizeTextArea from './useAutosizeTextArea';

interface InputProps{
  labelText: string
} 

const Disperse: React.FC<InputProps> = ({labelText}) => {

  const [value, setValue] = useState<string>("");
  const [numberOfNumbers, setNumberOfNumbers] = useState<number>(1);
  const [displayErros, setErros] = useState<string[]>([]);
  const [showOption, setShowOption] = useState<boolean>(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textLineNoref = useRef<HTMLDivElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;  
    setValue(val);  
  };  

  const  addMoreNumbers = (noNo: number) => {
    if(textLineNoref?.current){ 
    const lines = value?.split("\n");  
    const runTolen = lines ? lines.length : noNo;
    let html = '';  
    for (let i = 1; i <= runTolen; i++) {
        html += `<div class='number'>${ i }</div>`;
    } 
    // console.log("html ***** ", runTolen, html)
    setNumberOfNumbers(noNo + 1); 
      textLineNoref.current.innerHTML = html;
    }
    
}

const initEventListeners = () => {   
  if(textLineNoref.current && textAreaRef.current){ 
    textLineNoref.current.style.transform = `translateY(-${ textAreaRef.current.scrollTop }px)`; 
       addMoreNumbers(numberOfNumbers);
  }  
}   

const checkEventforNos = (e: React.UIEvent<HTMLTextAreaElement>) => {
  // console.log("textLineNoref ==== ", textLineNoref)
  // console.log("textAreaRef ==== ", textAreaRef)
} 

// useEffect(() => {
//   initEventListeners()
// }, [])

  // useEffect(() => { 
      // initEventListeners()  
  // }, [value]);


  const onSubmitHandle = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const lines = value?.split("\n");
    const erros: string[] = [];
    console.log('test...', lines)
    const splitLength= (str: string, opt: string) => str.split(opt);

    lines.forEach((dt,i) => {
      if(dt){
       let splittedDtSpace = splitLength(dt, ' '); 
       let splittedDtEqual = splitLength(dt, '='); 
       let splittedDtComma = splitLength(dt, ','); 

       // Check for Invalid address and amount
       if((splittedDtSpace.length > 1 &&  splittedDtSpace[0].length !== 42) 
       || (splittedDtEqual.length > 1 &&  splittedDtEqual[0].length !== 42) 
       || (splittedDtComma.length > 1 &&  splittedDtComma[0].length !== 42) ){
        erros.push(`Line ${i+1} invalid Ethereum address and wrong amount`);
       }  
        
        if(dt.slice(0, 2) !== '0x' ){
          erros.push(`Line ${i+1} invalid Ethereum address`);
        } 

        // Check for Invalid amount  
        if( ( splittedDtSpace.length > 1 && isNaN(Number(splittedDtSpace[1])) ) 
        || ( splittedDtEqual.length > 1 && isNaN(Number(splittedDtEqual[1]))  )
        || ( splittedDtComma.length > 1  && isNaN(Number(splittedDtComma[1])) ) ){
          erros.push(`Line ${i+1} wrong amount`);
        } 


      // Duplicate Val check
        let lineNosArr: number[] = [];
        lines.reduce(function(a, e, i) {
            if (e === dt){
              lineNosArr.push(i+1);
            }
            return a;
        }, []);
        
        if(lineNosArr.length > 1){
          setShowOption(true);
            let showAddr = (splittedDtSpace.length > 1 && splittedDtSpace[0]) 
                          || (splittedDtEqual.length > 1 && splittedDtEqual[0])
                          || (splittedDtComma.length > 1 && splittedDtComma[0]); 
            let duErr = ` ${showAddr}  duplicate in  Line: ${ lineNosArr.join(',') }`;
            if(!erros.includes(duErr)){
              erros.push(duErr);
            } 
          }else{
            setShowOption(false);
          }
      } 

    }); 

    console.log("erros *** ", erros)

    setErros(erros);
  }
  
  
  return (
    <> 
      <form onSubmit={onSubmitHandle} >
      <label htmlFor='message' className="block ml-4 text-sm font-normal text-white">
      {labelText}
    </label>
    <div className='custom-textarea'>
    <textarea 
        ref={textAreaRef} 
        rows={4}
        className="textarea block bg-black text-white p-2.5 pl-6 w-full text-sm rounded-lg"  
        onChange={(e) => handleChange(e) } 
        value={value} 
        onScroll={checkEventforNos}
      />

    <div ref={textLineNoref} className='linenumbers p-3.5' ></div>
    </div>
    
    <span className='text-white ml-4 dark:text-white'>Separated by ',' or '' or '='</span>
    <span className="text-white dark:text-white float-right">Show Example</span>


    {
      showOption ? <div className='flex float-right mt-10'>
        <div className='flex-none w-full'>Keep the first one</div>
        <div className='flex-none w-full'>Combine Balance</div>
      </div> : ''
    }
   
{
  displayErros.length ?  
  <div className=" mt-6 bg-none border border-red-700 text-red-700 px-4 py-3 rounded relative" role="alert">
   
  <div className="flex items-center justify-between"> 
  <div className="py-1"><svg className="fill-current h-6 w-6 text-red-700 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      {
      displayErros.map((err, index) =>  
      <> 
        <span key={index} className="block sm:inline">{err}</span>  <br />
      </> 
      )
      } 
       </div>
      </div> 
      </div>
  : ''
}
   

    <button type='submit' className='m-10 px-6 py-2 text-purple-100 w-full rounded-full bg-gradient-to-r from-purple-400 to-blue-500'>Next</button>

      </form>
    </>
  )
}

export default Disperse;