'use client';

import { CircleX } from 'lucide-react';
import React, { RefObject } from 'react';
import Episode from '@/interface/episode';
import Button from '../ui/button';

export type ModalProps = {
    open: boolean;
    episodesRef: RefObject<HTMLSelectElement>;
    episodes: Episode[];
    publicDateRef: RefObject<HTMLInputElement>;
    onToPrivate: () => void;
    onDelete: () => void;
    onCancel: () => void;
    onOk: () => void;
};

const EpisodeControl = ({ open, episodes, episodesRef, publicDateRef, onToPrivate, onDelete, onCancel, onOk }: ModalProps) => {
    return open ? (
        <>
            <div className="rounded-md bg-white border top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-[44%] p-5 flex flex-col items-start absolute z-20">
                <div className="w-full flex justify-between">
                    <h1 className="text-2xl font-bold">エピソード操作</h1>
                    <button onClick={() => onCancel() } className='hover:text-gray-500'>
                        <CircleX />
                    </button>
                </div>
                
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
                            onChange={() => { onOk(); }}
                        /> <br />
                        <Button className='mt-2 w-full hover:bg-red-100' onClick={() => { onToPrivate(); }}>非公開</Button>
                    </div>

                    <div className="w-1/2 border px-2 py-2 rounded flex flex-col justify-center items-center">
                        <div className="text-xl font-bold">
                            エピソード削除
                        </div>

                        <Button className='mt-2 w-full hover:bg-red-100' onClick={() => onDelete()}>削除</Button>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <></>
    );
};

export default EpisodeControl;