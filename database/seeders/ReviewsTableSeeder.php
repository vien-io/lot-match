<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReviewsTableSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('reviews')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $now = Carbon::now();

        $reviews = [
            [
                'id' => 1,
                'block_id' => 1,
                'rating' => 4,
                'user_name' => 'Clyde',
                'user_id' => 1,
                'comment' => 'Quiet and peaceful, perfect for a family home.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'block_id' => 1,
                'rating' => 3,
                'user_name' => 'Bob',
                'user_id' => 2,
                'comment' => 'Good location but some drainage issues during rainy season.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'block_id' => 2,
                'rating' => 5,
                'user_name' => 'Charlie',
                'user_id' => 3,
                'comment' => 'Absolutely love the community and vibe here!',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'block_id' => 1,
                'rating' => 4,
                'user_name' => 'Dana',
                'user_id' => 4,
                'comment' => 'Well-maintained area and friendly neighbors.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'block_id' => 2,
                'rating' => 3,
                'user_name' => 'Eli',
                'user_id' => 5,
                'comment' => 'Some noise from nearby construction, but overall okay.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 6,
                'block_id' => 1,
                'rating' => 4,
                'user_name' => 'Faye',
                'user_id' => 6,
                'comment' => 'Fantastic layout and very secure environment.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 7,
                'block_id' => 2,
                'rating' => 2,
                'user_name' => 'George',
                'user_id' => 7,
                'comment' => 'Needs better lighting at night and more green spaces.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 8,
                'block_id' => 1,
                'rating' => 3,
                'user_name' => 'Hannah',
                'user_id' => 8,
                'comment' => 'Decent place, but the roads could use repairs.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 9,
                'block_id' => 2,
                'rating' => 4,
                'user_name' => 'Ivan',
                'user_id' => 9,
                'comment' => 'Good value for the price and accessible location.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 10,
                'block_id' => 1,
                'rating' => 2,
                'user_name' => 'Jane',
                'user_id' => 10,
                'comment' => 'Had high hopes but experienced water supply issues.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 11,
                'block_id' => 2,
                'rating' => 5,
                'user_name' => 'Ken',
                'user_id' => 11,
                'comment' => 'Perfect for retirees like me—calm and relaxing.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 12,
                'block_id' => 1,
                'rating' => 3,
                'user_name' => 'Lina',
                'user_id' => 12,
                'comment' => 'Nice design overall, but amenities are still incomplete.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
        
        foreach ($reviews as $review) {
            // prevent duplicate review insertion for same user and block
            $exists = DB::table('reviews')
                ->where('block_id', $review['block_id'])
                ->where('user_id', $review['user_id'])
                ->exists();

            if (!$exists) {
                DB::table('reviews')->insert($review);
            }
        }
    }
}
