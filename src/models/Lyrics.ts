import mongoose, { Document, Schema } from 'mongoose';

export interface ILyrics {
    lyrics: String;
    song: String;
    user_id: String;
}

export interface ILyricsModel extends ILyrics, Document {}

const LyricsSchema: Schema = new Schema(
    {
        lyrics: {
            type: String,
            required: true
        },
        song: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<ILyricsModel>('Lyrics', LyricsSchema);
