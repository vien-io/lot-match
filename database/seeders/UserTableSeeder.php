<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserTableSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        $users = [
            [
                'id' => 1,
                'name' => 'Clyde',
                'email' => 'clyde@example.com',
                'password' => bcrypt('password123'),  // Encrypting the password
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'name' => 'Bob',
                'email' => 'bob@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'name' => 'Charlie',
                'email' => 'charlie@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'name' => 'Dana',
                'email' => 'dana@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'name' => 'Eli',
                'email' => 'eli@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 6,
                'name' => 'Faye',
                'email' => 'faye@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 7,
                'name' => 'George',
                'email' => 'george@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 8,
                'name' => 'Hannah',
                'email' => 'hannah@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 9,
                'name' => 'Ivan',
                'email' => 'ivan@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 10,
                'name' => 'Jane',
                'email' => 'jane@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 11,
                'name' => 'Ken',
                'email' => 'ken@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 12,
                'name' => 'Lina',
                'email' => 'lina@example.com',
                'password' => bcrypt('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('users')->insert($users);
    }
}
