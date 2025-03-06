'use client';

import { ReactElement, useState, useEffect, FormEvent } from "react";
import { Kaisei_Decol } from "next/font/google";
import { toast } from "sonner";

import ApiResponse from "@/interface/response";
import ButtonLink from "@/components/ui/buttonLink";
import UpdateIcon from '@mui/icons-material/Update';
import SyncIcon from '@mui/icons-material/Sync';
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function Novels(): ReactElement {
    return (
        <>
        <div className={`mt-3 text-3xl text-center ${kaisei_decol.className}`}>
            小説管理
        </div>
        </>
    );
}