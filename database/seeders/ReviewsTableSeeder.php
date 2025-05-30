<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReviewsTableSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks to safely truncate the table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('reviews')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $blocks = [1, 2, 3]; // Example block IDs, adjust as needed
        $sentiments = ['positive', 'neutral', 'negative'];
        $comments = [
            'Great place, loved it!',
            'It was okay, nothing special.',
            'Had a bad experience here.',
            'Amazing atmosphere and service.',
            'Could be better.',
            'Not recommended.',
            'Will visit again!',
            'Average experience.',
            'Terrible customer support.',
            'Highly recommended for families.'
        ];

        $now = Carbon::now();

        for ($i = 1; $i <= 100; $i++) { // Generate 100 reviews
            $blockId = $blocks[array_rand($blocks)];
            $sentiment = $sentiments[array_rand($sentiments)];

            // Assign rating based on sentiment roughly
            switch ($sentiment) {
                case 'positive':
                    $rating = rand(4, 5);
                    break;
                case 'neutral':
                    $rating = rand(2, 3);
                    break;
                case 'negative':
                    $rating = rand(1, 2);
                    break;
            }

            DB::table('reviews')->insert([
                'user_id' => rand(1, 50), // Assuming you have 50 users
                'block_id' => $blockId,
                'rating' => $rating,
                'user_name' => 'User' . rand(1, 50),
                'created_at' => $now->copy()->subDays(rand(0, 365)), // random date within the past year
                'updated_at' => $now,
                'comment' => $comments[array_rand($comments)],
                'sentiment' => $sentiment,
            ]);
        }
    }
}
