<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserTableSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $users = [];

        for ($i = 1; $i <= 50; $i++) {
            $users[] = [
                'id' => $i,
                'name' => 'User' . $i,
                'email' => 'user' . $i . '@example.com',
                'password' => bcrypt('password123'),  
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

      
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('users')->insert($users);
    }
}
