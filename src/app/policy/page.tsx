'use client';

import { ReactElement } from "react";

export default function Policy(): ReactElement {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-4">ReNovel 利用規約</h1>

            <h2 className="text-xl font-semibold mt-6">第1条（総則）</h2>
            <p>本利用規約（以下、「本規約」といいます）は、ReNovel（以下、「本サイト」といいます）をご利用いただくにあたり、遵守していただく事項を定めるものです。利用者は、本サイトを利用することにより、本規約に同意したものとみなします。</p>

            <h2 className="text-xl font-semibold mt-6">第2条（著作権）</h2>
            <p>1. 本サイトに投稿された小説の著作権は、投稿者（作者）に帰属します。</p>
            <p>2. 投稿者は、本サイト上での公開に関して、必要な範囲で運営に対し利用を許諾するものとします。</p>
            <p>3. 他者の著作物を無断で投稿することは禁止します。</p>

            <h2 className="text-xl font-semibold mt-6">第3条（禁止事項）</h2>
            <ul className="list-disc pl-6">
                <li>他者の権利を侵害する行為</li>
                <li>公序良俗に反する内容の投稿</li>
                <li>過度な暴力表現、差別的表現、ヘイトスピーチ</li>
                <li>他者への誹謗中傷や嫌がらせ</li>
                <li>法律に違反する行為</li>
                <li>作者の許可を得ず他サイトに転載、また、ReNovelに投稿すること</li>
                <li>その他、運営が不適切と判断した行為</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">第4条（投稿の削除・アカウントの停止）</h2>
            <p>1. 運営は、上記禁止事項に該当すると判断した場合、投稿を削除することができます。</p>
            <p>2. 禁止事項に違反する行為が繰り返された場合、アカウントを停止または削除することがあります。</p>
            <p>3. 投稿の削除やアカウントの停止について、運営はその理由を説明する義務を負いません。</p>

            <h2 className="text-xl font-semibold mt-6">第5条（運営について）</h2>
            <p>1. 本サイトの運営は、有志のメンバーによって行われます。</p>
            <p>2. 運営への参加は自由ですが、報酬や給与は発生しません。</p>
            <p>3. 運営メンバーは、本サイトの健全な運営を目的とし、必要に応じて投稿の削除や規約の改定を行うことができます。</p>

            <h2 className="text-xl font-semibold mt-6">第6条（免責事項）</h2>
            <p>1. 本サイトの利用によって発生したいかなる損害についても、運営は責任を負いません。</p>
            <p>2. 運営は、予告なくサービスの内容を変更、停止することができます。</p>
            <p>3. 運営は、システムの不具合や障害によるデータ消失について責任を負いません。</p>

            <h2 className="text-xl font-semibold mt-6">第7条（規約の変更）</h2>
            <p>運営は、必要に応じて本規約を変更することができます。変更後の規約は、本サイト上で告知された時点で効力を生じるものとします。</p>

            <h2 className="text-xl font-semibold mt-6">付則</h2>
            <p>本規約は、2025年2月19日より適用されます。</p>
        </div>
    )
}