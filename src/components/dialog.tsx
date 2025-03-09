'use client';

import React, { Ref } from 'react';


export type ModalProps = {
  open: boolean;
  idRef: Ref<HTMLInputElement>;
  onCancel: () => void;
  onOk: () => void;
};

const AddUserDialog = ({ open, idRef, onCancel, onOk }: ModalProps) => {
  return open ? (
    <>
      <div className="rounded-md bg-white border top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-48 p-5 flex flex-col items-start absolute z-20">
        <h1 className="text-xl font-bold">共同作者追加</h1>
        <p className="text-lg mt-2">追加するユーザーのIDを入力してください</p>

        <input 
            type="text"
            className='w-full rounded border px-4 py-2 mt-2'
            placeholder='ユーザーID(スラッグ)'
            ref={idRef}
        />

        <div className="flex mt-2 w-full justify-center">
          <button
            className="hover:bg-gray-100 rounded border px-4 py-2 mr-1"
            onClick={() => onOk()}
          >
            決定
          </button>

          <button
            className="bg-red-400 hover:bg-red-500 rounded border text-white px-4 py-2 ml-1"
            onClick={() => onCancel()}
          >
            閉じる
          </button>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default AddUserDialog;