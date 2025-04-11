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
                'lot_id' => 1,
                'rating' => 4.5,
                'user_name' => 'Clyde',
                'user_id' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'block_id' => 1,
                'lot_id' => 2,
                'rating' => 3.8,
                'user_name' => 'Bob',
                'user_id' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'block_id' => 2,
                'lot_id' => 3,
                'rating' => 5.0,
                'user_name' => 'Charlie',
                'user_id' => 3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'block_id' => 1,
                'lot_id' => 4,
                'rating' => 4.2,
                'user_name' => 'Dana',
                'user_id' => 4,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'block_id' => 2,
                'lot_id' => 5,
                'rating' => 3.6,
                'user_name' => 'Eli',
                'user_id' => 5,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 6,
                'block_id' => 1,
                'lot_id' => 6,
                'rating' => 4.9,
                'user_name' => 'Faye',
                'user_id' => 6,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 7,
                'block_id' => 2,
                'lot_id' => 7,
                'rating' => 2.8,
                'user_name' => 'George',
                'user_id' => 7,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 8,
                'block_id' => 1,
                'lot_id' => 8,
                'rating' => 3.2,
                'user_name' => 'Hannah',
                'user_id' => 8,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 9,
                'block_id' => 2,
                'lot_id' => 9,
                'rating' => 4.0,
                'user_name' => 'Ivan',
                'user_id' => 9,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 10,
                'block_id' => 1,
                'lot_id' => 10,
                'rating' => 2.5,
                'user_name' => 'Jane',
                'user_id' => 10,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 11,
                'block_id' => 2,
                'lot_id' => 11,
                'rating' => 5.0,
                'user_name' => 'Ken',
                'user_id' => 11,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 12,
                'block_id' => 1,
                'lot_id' => 12,
                'rating' => 3.7,
                'user_name' => 'Lina',
                'user_id' => 12,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
        foreach ($reviews as $review) {
            $exists = DB::table('reviews')->where('lot_id', $review['lot_id'])->exists();

            if (!$exists) {
                DB::table('reviews')->insert($review);
            }
        }
    }
}
