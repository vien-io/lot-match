<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->integer('block_number')->nullable()->after('price'); // Add block_number column
        });
    }

    public function down()
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->dropColumn('block_number'); // Remove column on rollback
        });
    }
};
