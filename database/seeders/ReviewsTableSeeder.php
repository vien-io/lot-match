<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReviewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */



    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('reviews')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $now = Carbon::now();

        // reviews sample
        $reviews = [
            [
                'id' => 1,
                'block_id' => 1,
                'lot_id' => 1,
                'rating' => 4.5,
                'user_name' => 'Clyde',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'block_id' => 1,
                'lot_id' => 2,
                'rating' => 3.8,
                'user_name' => 'Bob',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'block_id' => 2,
                'lot_id' => 3,
                'rating' => 5.0,
                'user_name' => 'Charlie',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'block_id' => 1,
                'lot_id' => 4,
                'rating' => 4.2,
                'user_name' => 'Dana',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'block_id' => 2,
                'lot_id' => 5,
                'rating' => 3.6,
                'user_name' => 'Eli',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 6,
                'block_id' => 1,
                'lot_id' => 6,
                'rating' => 4.9,
                'user_name' => 'Faye',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 7,
                'block_id' => 2,
                'lot_id' => 7,
                'rating' => 2.8,
                'user_name' => 'George',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 8,
                'block_id' => 1,
                'lot_id' => 8,
                'rating' => 3.2,
                'user_name' => 'Hannah',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 9,
                'block_id' => 2,
                'lot_id' => 9,
                'rating' => 4.0,
                'user_name' => 'Ivan',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 10,
                'block_id' => 1,
                'lot_id' => 10,
                'rating' => 2.5,
                'user_name' => 'Jane',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 11,
                'block_id' => 2,
                'lot_id' => 11,
                'rating' => 5.0,
                'user_name' => 'Ken',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 12,
                'block_id' => 1,
                'lot_id' => 12,
                'rating' => 3.7,
                'user_name' => 'Lina',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
        foreach ($reviews as $review) {
            // Check if the review for the specific lot_id already exists
            $exists = DB::table('reviews')->where('lot_id', $review['lot_id'])->exists();
            
            // If no review exists for this lot_id, insert the new review
            if (!$exists) {
                DB::table('reviews')->insert($review);
            }
        }
        
    }
}
