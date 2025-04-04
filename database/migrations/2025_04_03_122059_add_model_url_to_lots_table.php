<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (Schema::hasTable('lots')) {
            if (!Schema::hasColumn('lots', 'model_url')) {
                Schema::table('lots', function (Blueprint $table) {
                    $table->string('model_url')->nullable(); // Add model_url column
                });
            }
        }
    }

    public function down()
    {
        // Drop the foreign key constraint first
        if (Schema::hasTable('lots') && Schema::hasColumn('lots', 'block_id')) {
            Schema::table('lots', function (Blueprint $table) {
                // Drop the foreign key constraint by referencing its name
                $table->dropForeign('lots_block_id_foreign'); // Drop foreign key
                $table->dropColumn('block_id'); // Drop block_id column
            });
        }
    
        // Drop model_url column if exists
        if (Schema::hasColumn('lots', 'model_url')) {
            Schema::table('lots', function (Blueprint $table) {
                $table->dropColumn('model_url'); // Drop model_url column
            });
        }
    }
    

};
