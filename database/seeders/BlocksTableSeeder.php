<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BlocksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('reviews')->delete(); 
        DB::table('lots')->delete();
        DB::table('blocks')->delete();
        DB::table('users')->truncate(); 
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('blocks')->insert([
            [
                'name' => 'Block 1',
                'description' => 'This is a description for Block 1.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Block 2',
                'description' => 'This is a description for Block 2.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Block 3',
                'description' => 'This is a description for Block 3.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        $this->call([
            UserTableSeeder::class,
            LotSeeder::class,
            ReviewsTableSeeder::class,
        ]);
    }
}
