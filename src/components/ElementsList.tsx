import { useElementeStore } from '@/stores/elementsStore';
import { Paintbrush, Search } from 'lucide-react'
import {useState} from 'react'
import Elements from './Elements'

const ElementsList = () => {
  const [value, setValue] = useState('');
  const { elementsList, clearCanvasElements } = useElementeStore()

  return (
    <div className='relative min-w-[22rem] w-[22rem] h-full border-l-[1px]'>
      <div className='w-full h-12 flex gap-2 items-center justify-start px-4 border-b-[2px]'>
        <Search className='text-gray-500'/>
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Search elements...'
          className='w-full h-full active:outline-none focus:outline-none bg-transparent border-none text-gray-800 placeholder:text-gray-400'
        />
      </div>

      <div className='w-full h-[calc(100dvh-6rem)]'>
        <div className='max-h-[calc(100dvh-6rem)] flex flex-wrap gap-2 p-3 overflow-y-auto justify-start'>
          {elementsList.filter((element) => element.name.toLowerCase().includes(value.toLowerCase())).map((element) => (
            <Elements
              key={element.elementId}
              element={element}
            />
          ))}
        </div>
      </div>

      <div className='w-full h-12 flex items-center justify-center text-gray-500 border-t-2'>
        <span>Infinite Craft</span>
      </div>

      <div className='absolute right-[22rem] top-0 w-fit bg-transparent flex items-center justify-end p-2'>
        <button onClick={clearCanvasElements} className='w-9 h-9 flex items-center justify-center rounded-full hover:border-2 border-gray-600 active:bg-gray-200'>
          <Paintbrush size={20} className='text-gray-600'/>
        </button>
      </div>
    </div>
  )
}

export default ElementsList