'use client';

import React, { Ref, useRef, RefObject } from 'react';
import Episode from '@/interface/episode';
import Button from '../ui/button';


export type ModalProps = {
    open: boolean;
    episodesRef: RefObject<HTMLSelectElement>;
    episodes: Episode[];
    publicDateRef: RefObject<HTMLInputElement>;
    onDelete: () => void;
    onCancel: () => void;
    onOk: () => void;
};

const EpisodeControl = ({ open, episodes, episodesRef, publicDateRef, onDelete, onCancel, onOk }: ModalProps) => {
    return open ? (
        <>
            <div className="rounded-md bg-white border top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-[44%] p-5 flex flex-col items-start absolute z-20">
                <h1 className="text-2xl font-bold">エピソード操作</h1>
                <p className="text-lg mt-2">エピソードを選択し、操作を決定してください</p>

                <select
                    className='w-full rounded border px-4 py-2 mt-2'
                    ref={episodesRef}>
                    <option disabled selected>選択してください</option>
                    { episodes.map((episode: Episode) => {
                        return (
                            <option value={ episode.slug }>{ episode.title }</option>
                        );
                    }) }
                </select>

                <div className="flex w-full mt-5">
                    <div className="w-1/2 border px-2 py-2 rounded">
                        <div className="text-xl font-bold">
                            エピソード公開
                        </div>

                        <input 
                            type="datetime-local" 
                            className='mt-2 w-full border rounded px-4 py-2 hover:bg-gray-100'
                            ref={publicDateRef}
                        />
                    </div>

                    <div className="w-1/2 border px-2 py-2 rounded">
                        <div className="text-xl font-bold">
                            エピソード削除
                        </div>

                        <Button className='mt-2 w-full hover:bg-red-100' onClick={() => onDelete()}>削除</Button>
                    </div>
                </div>

                <div className="flex mt-5 w-full justify-center">
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

export default EpisodeControl;